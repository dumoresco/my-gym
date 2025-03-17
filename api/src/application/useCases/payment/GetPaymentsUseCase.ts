import { prismaClient } from "../../libs/prismaClient";
import { validate as validateUUID } from "uuid";

import { UserNotFound } from "../../errors/UserNotFound";
import { InvalidFormatUUID } from "../../errors/InvalidFormatUUID";

interface IInputGetPaymentUseCase {
  userId: string;
}

interface IOutputGetPaymentUseCase {
  name: string;
  email: string;
  amount: number;
  date: string;
  subscription: {
    name: string;
  };
}

export class GetPaymentUseCase {
  async execute({
    userId,
  }: IInputGetPaymentUseCase): Promise<IOutputGetPaymentUseCase[]> {
    const isValidUUID = validateUUID(userId);
    if (!isValidUUID) throw new InvalidFormatUUID();

    const userExists = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) throw new UserNotFound();

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const payments = await prismaClient.payment.findMany({
      where: {
        GymClient: {
          ownerId: userId,
        },
        paymentDate: {
          gte: sixMonthsAgo,
        },
      },
      orderBy: {
        paymentDate: "desc",
      },
      take: 5,
      include: {
        GymClient: true,
        Subscription: true,
      },
    });

    return payments.map((payment) => ({
      name: payment.GymClient.name,
      email: payment.GymClient.email,
      amount: payment.amount,
      date: payment.paymentDate.toISOString(),
      subscription: {
        name: payment.Subscription.name,
      },
    }));
  }
}
