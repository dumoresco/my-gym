"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxiosInterceptor } from "@/hooks/use-axios-interceptor";
import { Session } from "next-auth";
import DataTable from "@/components/ui/data-table";
import { useEffect } from "react";
import socket from "@/config/socket";
import { useCustomSooner } from "@/hooks/use-custom-sooner";
import { gymClientsTable } from "../dashboard/alunos/columns";

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
  const { successSooner } = useCustomSooner();
  useEffect(() => {
    // Conexão automática
    socket.connect();
    console.log(socket.connected); // false
    console.log("Conectado ao WebSocket:", socket.id);

    // Escutando o evento 'notification'
    socket.on("notification", (data) => {
      console.log("Notificação recebida", data.message);
      successSooner(` 🎉 ${data.message}`);
      // Aqui você pode tratar a notificação, exibir uma toast, ou atualizar o estado da UI
    });

    // Cleanup na desmontagem do componente
    return () => {
      socket.off("notification"); // Desassociar o evento quando o componente for desmontado
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
