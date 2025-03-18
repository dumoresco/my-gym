/* eslint-disable @typescript-eslint/no-explicit-any */
import { Session } from "next-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosInterceptor } from "./use-axios-interceptor";
import { useCustomSooner } from "./use-custom-sooner";
import { AxiosError } from "axios";

export const useSubscriptions = ({ session }: { session?: Session }) => {
  const api = useAxiosInterceptor(session);
  const queryClient = useQueryClient();

  const { errorSooner, successSooner } = useCustomSooner();

  const deleteSubscription = async (id: string) => {
    try {
      const response = await api.delete(`/subscription/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteMutation = useMutation({
    mutationFn: deleteSubscription,
    onSuccess: () => {
      successSooner("Plano deletado com sucesso!");
      return queryClient.invalidateQueries({
        queryKey: ["subscriptions"],
        exact: true,
      });
    },
    onError: (error: AxiosError) => {
      console.error("Erro ao deletar a subscription:", error);
      errorSooner(
        "Erro ao deletar o plano: " +
          ((error.response?.data as { message?: string })?.message ||
            "Erro desconhecido")
      );
    },
  });

  const addSubscription = async (data: any) => {
    try {
      const response = await api.post(
        `/subscription/${session?.user?.id}`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const addMutation = useMutation({
    mutationFn: addSubscription,
    onSuccess: () => {
      successSooner("Plano adicionado com sucesso!");
      return queryClient.invalidateQueries({
        queryKey: ["subscriptions"],
        exact: true,
      });
    },
    onError: (error: AxiosError) => {
      errorSooner(
        "Erro ao adicionar o plano: " +
          ((error.response?.data as { message?: string })?.message ||
            "Erro desconhecido")
      );
    },
  });

  return { deleteMutation, addMutation };
};
