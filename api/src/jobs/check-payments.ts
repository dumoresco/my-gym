import { addMonths } from "date-fns";
import { prismaClient } from "../application/libs/prismaClient";

export async function checkPayments() {
  const users = await prismaClient.gymClient.findMany({
    where: {
      paymentStatus: {
        equals: "PAID",
      },
    },
  });
  for (const user of users) {
    const lastPaymentDate = user?.subscriptionLastPayment
      ? new Date(user.subscriptionLastPayment)
      : new Date();
    const nextPaymentDate = addMonths(lastPaymentDate, 1);

    if (new Date() >= nextPaymentDate) {
      await prismaClient.gymClient.update({
        where: { id: user.id },
        data: { paymentStatus: "UNPAID" },
      });
    }
  }
}
