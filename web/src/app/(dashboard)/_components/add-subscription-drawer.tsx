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
import { subscriptionSchema } from "@/app/schemas/subscription.schema";
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
import InputCurrency from "@/components/input-currency";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/ui/date-picker-range";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";

export const AddSubscriptionDrawer = ({ session }: { session: Session }) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { addMutation } = useSubscriptions({ session });
  const form = useForm<z.infer<typeof subscriptionSchema>>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: "",
      price: 0,
      startDate: "",
      endDate: "",
    },
  });

  const handleDateChange = (range: DateRange | undefined) => {
    form.setValue("startDate", range?.from ? range.from.toISOString() : "");
    form.setValue("endDate", range?.to ? range.to.toISOString() : "");
  };

  const handleSubmit = form.handleSubmit((data) => {
    addMutation.mutate(data);

    setSheetOpen(false);
    form.reset();
  });

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button>Adicionar Plano</Button>
      </SheetTrigger>
      <SheetContent className=" rounded-l-2xl ">
        <SheetHeader>
          <SheetTitle>Adicionar Plano</SheetTitle>
          <SheetDescription>
            Adicione um novo plano de mensalidade
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

            {/* Preço */}
            <FormField
              control={form.control}
              name="price"
              render={({}) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Preço</FormLabel>
                  <FormControl>
                    <InputCurrency
                      onChange={(event) =>
                        form.setValue(
                          "price",
                          parseFloat(event.target.value) || 0
                        )
                      }
                      value={form.getValues("price")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Período de Assinatura */}
            <FormItem className="flex flex-col w-full">
              <FormLabel>Período</FormLabel>
              <FormControl>
                <DatePickerWithRange
                  initialDateRange={{
                    from: form.getValues("startDate")
                      ? new Date(form.getValues("startDate"))
                      : undefined,
                    to: form.getValues("endDate")
                      ? new Date(form.getValues("endDate"))
                      : undefined,
                  }}
                  onChange={handleDateChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </form>
        </FormProvider>
        <SheetFooter>
          <SheetClose asChild>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={addMutation.isPending}
            >
              {addMutation.isPending ? (
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
