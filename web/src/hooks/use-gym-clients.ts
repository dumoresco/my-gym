/* eslint-disable @typescript-eslint/no-explicit-any */
import { Session } from "next-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosInterceptor } from "./use-axios-interceptor";
import { useCustomSooner } from "./use-custom-sooner";
import { AxiosError } from "axios";

export const useGymClients = ({ session }: { session?: Session }) => {
  const api = useAxiosInterceptor(session);
  const queryClient = useQueryClient();

  const { errorSooner, successSooner } = useCustomSooner();

  const updateGymClient = async (id: string, data: any) => {
    try {
      const response = await api.put(`/gym-clients/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateGymClient(id, data),
    onSuccess: () => {
      successSooner("Aluno atualizado com sucesso!");
      return queryClient.invalidateQueries({
        queryKey: ["gym-clients"],
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

  const createGymClient = async (data: any) => {
    console.log("Data", data);
    try {
      const response = await api.post(
        `/gym-clients/${session?.user?.id}`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const createMutation = useMutation({
    mutationFn: (data: any) => createGymClient(data),
    onSuccess: () => {
      successSooner("Aluno adicionado com sucesso!");
      return queryClient.invalidateQueries({
        queryKey: ["gym-clients"],
        exact: true,
      });
    },
  });

  return { updateMutation, createMutation };
};
