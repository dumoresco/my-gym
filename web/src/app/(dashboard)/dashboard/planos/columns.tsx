"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { SubscriptionTableActions } from "../../_components/subscriptions-table-actions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Subscription = {
  id: string;
  name: string;
  price: number;
  status: string;
  startDate: string;
  endDate: string;
};

export const columns: ColumnDef<Subscription>[] = [
  {
    id: "id",
    header: "ID",
    accessorKey: "id",
  },
  {
    id: "name",
    header: "Nome",
    accessorKey: "name",
  },
  {
    id: "price",
    header: "Preço",
    accessorKey: "price",
    cell: ({ row }) =>
      row.original.price.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
  },
  {
    id: "startDate",
    header: "Data de início",
    accessorKey: "startDate",
    cell: ({ row }) => {
      return (
        <span>{format(new Date(row.original.startDate), "dd/MM/yyyy")}</span>
      );
    },
  },
  {
    id: "endDate",
    header: "Data de término",
    accessorKey: "endDate",
    cell: ({ row }) => {
      return (
        <span>{format(new Date(row.original.endDate), "dd/MM/yyyy")}</span>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const STATUS_CLASSES = {
        ACTIVE: "bg-green-600/10 text-green-600",
        SUSPENDED: "bg-red-600/10 text-red-600",
        INACTIVE: "bg-yellow-600/10 text-yellow-600",
      };

      const STATUS_FORMATTED = {
        ACTIVE: "Ativo",
        SUSPENDED: "Suspenso",
        INACTIVE: "Inativo",
      };

      return (
        <div>
          <Badge
            className={
              STATUS_CLASSES[row.original.status as keyof typeof STATUS_CLASSES]
            }
          >
            {
              STATUS_FORMATTED[
                row.original.status as keyof typeof STATUS_FORMATTED
              ]
            }
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Ações",
    accessorKey: "id",
    cell: ({ row }) => {
      return <SubscriptionTableActions id={row.original.id} />;
    },
  },
];
