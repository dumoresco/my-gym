"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { GymClientsTableActions } from "../../_components/gym-clients-table-actions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type GymClient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  inactiveAt: string;
  ownerId: string;
  paymentStatus: string;
  subscriptionLastPayment: string;
  subscriptionId: string;
};

export const gymClientsTable: ColumnDef<GymClient>[] = [
  {
    id: "name",
    header: "Nome",
    accessorKey: "name",
    cell: ({ row }) => {
      return (
        <div>
          <div>{row.original.name}</div>
          <div className="text-sm text-gray-500">{row.original.email}</div>
        </div>
      );
    },
  },
  // phone
  {
    id: "phone",
    header: "Telefone",
    accessorKey: "phone",
    cell: ({ row }) => {
      const formattedPhone = row.original.phone.replace(
        /(\d{2})(\d{5})(\d{4})/,
        "($1) $2-$3"
      );
      return (
        <div>
          <div>{formattedPhone}</div>
        </div>
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
    id: "paymentStatus",
    header: "Status do pagamento",
    accessorKey: "paymentStatus",
    cell: ({ row }) => {
      const PAYMENT_STATUS_CLASSES = {
        PAID: "bg-green-600/10 text-green-600",
        PENDING: "bg-yellow-600/10 text-yellow-600",
        UNPAID: "bg-red-600/10 text-red-600",
      };

      const PAYMENT_STATUS_FORMATTED = {
        PAID: "Pago",
        PENDING: "Pendente",
        UNPAID: "Atrasado",
      };

      return (
        <div className="flex flex-col">
          <Badge
            className={
              PAYMENT_STATUS_CLASSES[
                row.original
                  .paymentStatus as keyof typeof PAYMENT_STATUS_CLASSES
              ]
            }
          >
            {
              PAYMENT_STATUS_FORMATTED[
                row.original
                  .paymentStatus as keyof typeof PAYMENT_STATUS_FORMATTED
              ]
            }
          </Badge>
          <span className="text-xs text-gray-500 mt-1">
            {row.original.subscriptionLastPayment
              ? `  Último pagamento: ${format(
                  new Date(row.original.subscriptionLastPayment),
                  "dd/MM/yyyy"
                )}`
              : ""}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Ações",
    accessorKey: "id",
    cell: ({ row }) => {
      return <GymClientsTableActions client={row.original} />;
    },
  },
];
