export default async function SubscriptionPage({
  params,
}: {
  params: Promise<{ subscriptionId: string }>;
}) {
  const { subscriptionId } = await params;
  return <div>SubscriptionId: {subscriptionId}</div>;
}
