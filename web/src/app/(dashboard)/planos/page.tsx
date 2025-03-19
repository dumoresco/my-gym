import { auth } from "../../../../auth";
import { SubscriptionTable } from "../_components/subscriptions-table";
import { AddSubscriptionDrawer } from "../_components/add-subscription-drawer";

export default async function SubscriptionPage() {
  const session = await auth();

  if (!session) {
    return null;
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-end">
        <AddSubscriptionDrawer session={session} />
      </div>
      <SubscriptionTable session={session} />
    </>
  );
}
