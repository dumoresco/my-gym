"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Session } from "next-auth";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useGymClients } from "@/hooks/use-gym-clients";
import { createGymClientSchema } from "@/app/schemas/gym-client-schema";
import { useQuery } from "@tanstack/react-query";
import { useAxiosInterceptor } from "@/hooks/use-axios-interceptor";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";

export type SubscriptionResponse = {
  subscriptions: {
    id: string;
    name: string;
    price: number;
    status: string;
    startDate: string;
    endDate: string;
  }[];
};
export const AddGymClientDrawer = ({ session }: { session: Session }) => {
  const api = useAxiosInterceptor(session);

  const [sheetOpen, setSheetOpen] = useState(false);
  const { createMutation } = useGymClients({ session });
  const form = useForm<z.infer<typeof createGymClientSchema>>({
    resolver: zodResolver(createGymClientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subscriptionId: "",
      taxId: "",
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    createMutation.mutate(data);

    setSheetOpen(false);
    form.reset();
  });

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

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button>Adicionar Aluno</Button>
      </SheetTrigger>
      <SheetContent className=" rounded-l-2xl ">
        <SheetHeader>
          <SheetTitle>Adicionar Aluno</SheetTitle>
          <SheetDescription>
            Adicione um novo aluno ao seu sistema.
          </SheetDescription>
        </SheetHeader>
        <FormProvider {...form}>
          <form className="flex-1 w-full p-4 gap-4 flex flex-col">
            {/* Nome do Plano */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Telefone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ID da Assinatura */}
            <FormField
              control={form.control}
              name="subscriptionId"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Plano de Assinatura</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      defaultValue=""
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="border border-gray-300 rounded-md p-2 w-full h-12">
                        <SelectValue>
                          <SelectValue placeholder="Selecione um plano" />
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {isLoading ? (
                            <SelectItem value="" disabled>
                              Carregando...
                            </SelectItem>
                          ) : (
                            data?.subscriptions.map((subscription) => (
                              <SelectItem
                                key={subscription.id}
                                value={subscription.id}
                              >
                                {subscription.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CPF */}
            <FormField
              control={form.control}
              name="taxId"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </FormProvider>
        <SheetFooter>
          <SheetClose asChild>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                "Adicionar"
              )}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
