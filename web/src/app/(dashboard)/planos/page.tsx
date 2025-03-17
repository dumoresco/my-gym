import { auth } from "../../../../auth";

export default async function SubscriptionPage() {
  const session = await auth();

  if (!session) {
    return null;
  }

  return <div></div>;
}
