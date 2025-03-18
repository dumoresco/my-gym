import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import { EllipsisVertical } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const SubscriptionTableActions = ({ id }: { id: string }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { deleteMutation } = useSubscriptions({
    session: session ?? undefined,
  });

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
            router.push(`/planos/${id}`);
          }}
        >
          Visualizar
        </DropdownMenuItem>
        <DropdownMenuItem>Editar</DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            deleteMutation.mutate(id);
          }}
        >
          Deletar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
