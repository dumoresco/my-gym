import WebSocket from "ws";

let wss: WebSocket.Server;

export function startWebSocketServer(server: any) {
  wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("Cliente conectado");
    ws.on("message", (message) => {
      console.log("Mensagem recebida:", message);
    });
  });
}

// Enviar uma mensagem para todos os clientes conectados
export function sendPaymentUpdate(message: string) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}
