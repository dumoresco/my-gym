"use client";

import CountUp from "react-countup";
import { useQuery } from "@tanstack/react-query";
import { useAxiosInterceptor } from "@/hooks/use-axios-interceptor";
import { Session } from "next-auth";
import { AlertCircle, Receipt, UserRoundCheck, UserRoundX } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import MetricCardSkeleton from "./metric-card-skeleton";
import { Card, CardContent } from "@/components/ui/card";

type MetricsResponse = {
  activeClients: number;
  inactiveClients: number;
  monthlyRevenue: number;
  defaultedClients: number;
};

export const Metrics = ({ session }: { session: Session }) => {
  const api = useAxiosInterceptor(session);

  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  const fetchMetrics = async () => {
    const response = await api.get<MetricsResponse>(
      `/metrics/${session.user.id}?month=${month}&year=${year}`
    );
    return response.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["metrics"],
    queryFn: fetchMetrics,
  });

  console.log(data);
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error)
    return (
      <div className="bg-red-500/10 text-red-500 border border-red-500 text-center p-2 rounded">
        Houve um erro ao carregar os dados
      </div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <MetricCard
        title="Clientes Ativos"
        value={data?.activeClients}
        icon={<UserRoundCheck size={18} />}
      />
      <MetricCard
        title="Clientes Inativos"
        value={data?.inactiveClients}
        icon={<UserRoundX size={18} />}
      />
      <MetricCard
        title="Receita Mensal"
        value={data?.monthlyRevenue}
        isCurrency
        icon={<Receipt size={18} />}
      />
      <MetricCard
        title="Clientes Inadimplentes"
        value={data?.defaultedClients}
        icon={<AlertCircle size={18} />}
      />
    </div>
  );
};

const MetricCard = ({
  title,
  value,
  icon,
  isCurrency = false,
}: {
  title: string;
  value?: number;
  icon: React.ReactNode;
  isCurrency?: boolean;
}) => {
  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between">
          <h4>{title}</h4>
          {icon}
        </div>
        <span className="text-3xl font-semibold mt-2">
          <CountUp
            start={0}
            end={value!}
            duration={1}
            preserveValue
            separator="."
            decimal=","
            decimals={isCurrency ? 2 : 0}
            formattingFn={(n) =>
              isCurrency ? formatCurrency(n) : n.toString()
            }
          />
        </span>
      </CardContent>
    </Card>
  );
};
