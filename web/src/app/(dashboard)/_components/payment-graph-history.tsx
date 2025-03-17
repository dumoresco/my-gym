"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxiosInterceptor } from "@/hooks/use-axios-interceptor";
import { Session } from "next-auth";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTheme } from "next-themes";

type PaymentsResponse = {
  payments: {
    date: string;
    year: number;
    month: string;
    value: number;
  }[];
};

export const PaymentsGraphHistory = ({ session }: { session: Session }) => {
  const api = useAxiosInterceptor(session);

  const { theme } = useTheme();

  const fetchPaymentHistory = async () => {
    const response = await api.get<PaymentsResponse>(
      `/payments/graph/${session.user.id}`
    );
    return response.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["payments_history"],
    queryFn: fetchPaymentHistory,
  });
  if (isLoading) {
    return <span>Carregando...</span>;
  }
  console.log(data);

  if (error)
    return (
      <div className="bg-red-500/10 text-red-500 border border-red-500 text-center p-2 rounded">
        Houve um erro ao carregar os dados
      </div>
    );

  const formattedData = data?.payments.map((item) => ({
    month: `${item.month}/${item.year}`,
    value: item.value,
  }));

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Histórico de Pagamentos</CardTitle>
        <CardDescription>
          Receita mensal dos últimos {data?.payments.length} meses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={formattedData}>
            <XAxis dataKey="month" stroke="#363463" />
            <YAxis />
            <Tooltip
              formatter={(value) => [
                `${formatCurrency(value as number)}`,
                "Valor",
              ]}
              viewBox={{ x: 0, y: 0, width: 0, height: 0 }}
            />
            <Bar
              dataKey="value"
              fill={theme === "dark" ? "#FFFFFF" : "#000000"}
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
