import { auth } from "../../../../../auth";
import { AddSubscriptionDrawer } from "../../_components/add-subscription-drawer";
import { SubscriptionTable } from "../../_components/subscriptions-table";

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
