import { auth } from "../../../../../auth";
import { AddGymClientDrawer } from "../../_components/add-gym-client-drawer";
import { GymClientsTable } from "../../_components/gym-clients-table";

export default async function AlunosPage() {
  const session = await auth();

  if (!session) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-end mb-4">
        <AddGymClientDrawer session={session} />
      </div>
      <GymClientsTable session={session} />
    </div>
  );
}
