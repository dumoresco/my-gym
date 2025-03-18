"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxiosInterceptor } from "@/hooks/use-axios-interceptor";
import { Session } from "next-auth";
import DataTable from "@/components/ui/data-table";
import { gymClientsTable } from "../alunos/columns";
import { useEffect } from "react";

type SubscriptionResponse = {
  gymClients: {
    id: string;
    name: string;
    price: number;
    status: string;
    startDate: string;
    endDate: string;
  }[];
};

export const GymClientsTable = ({ session }: { session: Session }) => {
  useEffect(() => {
    // Conectar ao WebSocket
    const ws = new WebSocket("ws://localhost:3000"); // URL do servidor WebSocket

    ws.onopen = () => {
      console.log("Conectado ao servidor WebSocket");
    };

    ws.onmessage = (event) => {
      console.log("Mensagem recebida:", event.data);
    };

    ws.onerror = (error) => {
      console.error("Erro no WebSocket:", error);
    };

    return () => {
      ws.close(); // Fechar a conexão quando o componente for desmontado
    };
  }, []);

  const api = useAxiosInterceptor(session);

  const getGymClients = async () => {
    const response = await api.get<SubscriptionResponse>(
      `/gym-clients/${session.user.id}`
    );
    return response.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["gym-clients"],
    queryFn: getGymClients,
  });

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (error)
    return (
      <div className="bg-red-500/10 text-red-500 border border-red-500 text-center p-2 rounded">
        Houve um erro ao carregar os dados
      </div>
    );

  if (data) {
    return (
      <>
        <DataTable columns={gymClientsTable} data={data.gymClients} />
      </>
    );
  }
};
