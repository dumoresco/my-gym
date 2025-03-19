/* eslint-disable @typescript-eslint/no-explicit-any */
// src/socket.ts
import { io, Socket } from "socket.io-client";

const URL = "ws://localhost:8080";

// Cria uma instância de socket
const socket: Socket = io(URL, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  timeout: 20000,
  autoConnect: true, // Conecta automaticamente
});
// Fila para eventos enquanto desconectado
let pendingEvents: Array<{ event: string; data: any }> = [];

// Função para emitir eventos ou adicionar à fila se desconectado
const emitEvent = (event: string, data: any) => {
  if (socket.connected) {
    socket.emit(event, data);
  } else {
    pendingEvents.push({ event, data });
  }
};

// Reemite eventos pendentes após reconectar
const processPendingEvents = () => {
  pendingEvents.forEach(({ event, data }) => {
    socket.emit(event, data);
  });
  pendingEvents = []; // Limpa a fila após reemissão
};

// Event listeners para gerenciar a reconexão
socket.on("connect", () => {
  processPendingEvents(); // Reenvia eventos atrasados
});

socket.on("disconnect", () => {});

socket.on("reconnect", () => {
  processPendingEvents(); // Reenvia eventos ao reconectar
});

export { emitEvent };
export default socket;
