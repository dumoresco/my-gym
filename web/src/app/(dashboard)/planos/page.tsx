import { Suspense } from "react";
import { auth } from "../../../../auth";
import { SubscriptionTable } from "../_components/subscriptions-table";
import Loading from "../loading";
import { AddSubscriptionDrawer } from "../_components/add-subscription-drawer";

export default async function SubscriptionPage() {
  const session = await auth();

  if (!session) {
    return null;
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="mb-4 flex items-center justify-end">
        <AddSubscriptionDrawer session={session} />
      </div>
      <SubscriptionTable session={session} />
    </Suspense>
  );
}
