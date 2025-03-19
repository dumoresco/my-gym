"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxiosInterceptor } from "@/hooks/use-axios-interceptor";
import { Session } from "next-auth";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

type PaymentsResponse = {
  payments: {
    name: string;
    email: string;
    amount: number;
    date: string;
    subscription: {
      name: string;
    };
  }[];
};

export const LastPayments = ({ session }: { session: Session }) => {
  const api = useAxiosInterceptor(session);

  const fetchPaymentHistory = async () => {
    const response = await api.get<PaymentsResponse>(
      `/payments/${session.user.id}`
    );
    return response.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["last_payments"],
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

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Últimos Pagamentos</CardTitle>
        <CardDescription>Últimos 5 pagamentos realizados</CardDescription>
      </CardHeader>
      <CardContent>
        {data?.payments.map((payment) => (
          <div key={payment.date} className="mb-4">
            <div className="flex items-center justify-between ">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-md font-semibold ">
                    {payment?.name}
                  </span>
                  |
                  <span className="text-sm text-muted-foreground">
                    {payment.subscription?.name}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {payment.email} -{" "}
                  {format(new Date(payment.date), "dd/MM/yyyy")}
                </span>
              </div>
              <span className="text-md font-semibold text-right text-green-700">
                + {formatCurrency(payment.amount)}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
