/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Session } from "next-auth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SubscriptionResponse } from "./add-gym-client-drawer";
import { useAxiosInterceptor } from "@/hooks/use-axios-interceptor";
import { LoaderCircle } from "lucide-react";
import { useCustomSooner } from "@/hooks/use-custom-sooner";
import socket from "@/config/socket";

export const GenerateBillingDialog = ({
  client,
  session,
}: {
  client: any;
  session: Session;
}) => {
  const api = useAxiosInterceptor(session);
  const { successSooner } = useCustomSooner();
  const [dialogOpen, setDialogOpen] = useState(false);
  console.log("client", client);

  const getSubscriptions = async () => {
    const response = await api.get<SubscriptionResponse>(
      `/subscription/${session.user.id}`
    );
    return response.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: getSubscriptions,
  });

  const payload = {
    customerId: client.abacatePayCustomerId,
    products: [
      {
        externalId: client.subscriptionId,
        name: data?.subscriptions.find(
          (subscription) => subscription.id === client.subscriptionId
        )?.name,
        description: "Plano de assinatura",
        quantity: 1,
        price:
          (data?.subscriptions.find(
            (subscription) => subscription.id === client.subscriptionId
          )?.price ?? 0) * 100,
      },
    ],
    returnUrl: "https://localhost:3001/success",
    completionUrl: "https://localhost:3001/success",
  };

  const handleGenerateBilling = async () => {
    try {
      const response = await api.post<{ url: string }>(`/billing`, payload);
      console.log(response);
      return response.data; // Ensure the function returns the expected data
    } catch (error) {
      console.log(error);
      throw error; // Rethrow the error to handle it properly in the mutation
    }
  };

  const {
    mutate: generateBilling,
    data: billingData,
    isPending,
  } = useMutation<{ url: string }>({
    mutationFn: handleGenerateBilling,
  });

  useEffect(() => {
    if (dialogOpen && data) {
      generateBilling();
    }
  }, [dialogOpen]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);

    successSooner("Link copiado para a área de transferência");
  };

  const queryClient = useQueryClient();

  useEffect(() => {
    socket.connect();
    console.log(socket.connected);
    console.log("Conectado ao WebSocket:", socket.id);

    socket.on("notification", () => {
      queryClient.invalidateQueries({
        queryKey: ["gym-clients"],
        exact: true,
      });
      setDialogOpen(false);
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onClick={() => {
            setDialogOpen(true);
          }}
          onSelect={(e) => e.preventDefault()}
        >
          Gerar Cobrança
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gerar cobrança </DialogTitle>
          <DialogDescription>
            Usamos a AbacatePay para gerar cobrança
          </DialogDescription>
        </DialogHeader>
        <div className="w-full ">
          {isLoading || isPending ? (
            <div className="flex items-center justify-center gap-2">
              <LoaderCircle className="w-6 h-6 animate-spin" />
              Estamos gerando sua cobrança
            </div>
          ) : billingData && billingData.url ? (
            <div className="bg-primary-foreground items-center p-4 rounded flex">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    onClick={() => copyToClipboard(billingData.url)}
                    className="cursor-pointer font-bold text-sm"
                  >
                    {billingData.url}
                  </TooltipTrigger>
                  <TooltipContent>Copiar link</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};
