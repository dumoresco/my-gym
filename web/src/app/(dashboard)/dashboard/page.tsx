import { auth } from "../../../../auth";
import { Metrics } from "../_components/metrics";
import { PaymentsGraphHistory } from "../_components/payment-graph-history";
import { LastPayments } from "../_components/last-payments";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    return null;
  }

  return (
    <div>
      <Metrics session={session} />
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-5 gap-4">
        <PaymentsGraphHistory session={session} />
        <LastPayments session={session} />
      </div>
    </div>
  );
}
