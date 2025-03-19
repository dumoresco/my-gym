/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { EditGymClientDrawer } from "./edit-gym-client-drawer";

import { GenerateBillingDialog } from "./generate-billing-dialog";

export const GymClientsTableActions = ({ client }: { client: any }) => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"icon"} variant={"ghost"}>
          <EllipsisVertical size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            router.push(`/alunos/${client.id}`);
          }}
        >
          Visualizar
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <EditGymClientDrawer client={client} session={session!} />
        </DropdownMenuItem>
        {client.paymentStatus === "UNPAID" && (
          <DropdownMenuItem asChild>
            <GenerateBillingDialog client={client} session={session!} />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
