/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { updateGymClientSchema } from "@/app/schemas/gym-client-schema";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export const EditGymClientDrawer = ({
  client,
  session,
}: {
  client: any;
  session: Session;
}) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { updateMutation } = useGymClients({ session });
  const form = useForm<z.infer<typeof updateGymClientSchema>>({
    resolver: zodResolver(updateGymClientSchema),
    defaultValues: {
      name: client?.name,
      email: client.email,
      status: client.status,
      phone: client.phone,
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    updateMutation.mutate({
      id: client.id,
      data,
    });

    setSheetOpen(false);
    form.reset();
  });

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <DropdownMenuItem
          onClick={() => {
            setSheetOpen(true);
          }}
          onSelect={(e) => e.preventDefault()}
        >
          Editar
        </DropdownMenuItem>
      </SheetTrigger>
      <SheetContent className=" rounded-l-2xl ">
        <SheetHeader>
          <SheetTitle>Editar Aluno</SheetTitle>
          <SheetDescription>
            Você pode editar as informações do aluno
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
            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ACTIVE">Ativo</option>
                      <option value="INACTIVE">Inativo</option>
                      <option value="SUSPENDED">Suspenso</option>
                    </select>
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
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                "Editar"
              )}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
