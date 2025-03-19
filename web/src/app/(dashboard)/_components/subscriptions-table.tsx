"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxiosInterceptor } from "@/hooks/use-axios-interceptor";
import { Session } from "next-auth";
import DataTable from "@/components/ui/data-table";
import { columns } from "../dashboard/planos/columns";

type SubscriptionResponse = {
  subscriptions: {
    id: string;
    name: string;
    price: number;
    status: string;
    startDate: string;
    endDate: string;
  }[];
};

export const SubscriptionTable = ({ session }: { session: Session }) => {
  const api = useAxiosInterceptor(session);

  const getSubscriptions = async () => {
    const response = await api.get<SubscriptionResponse>(
      `/subscription/${session.user.id}`
    );
    return response.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: getSubscriptions,
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
        <DataTable columns={columns} data={data.subscriptions} />
      </>
    );
  }
};
