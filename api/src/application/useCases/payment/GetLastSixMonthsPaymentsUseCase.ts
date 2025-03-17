import { prismaClient } from "../../libs/prismaClient";
import { validate as validateUUID } from "uuid";

import { UserNotFound } from "../../errors/UserNotFound";
import { InvalidFormatUUID } from "../../errors/InvalidFormatUUID";

interface IInputGetLastSixPaymentUseCase {
  userId: string;
}

interface IOutputGetLastSixPaymentUseCase {
  value: number;
  date: string;
  month: string;
  year: number;
}

export class GetLastSixPaymentUseCase {
  async execute({
    userId,
  }: IInputGetLastSixPaymentUseCase): Promise<
    IOutputGetLastSixPaymentUseCase[]
  > {
    const isValidUUID = validateUUID(userId);
    if (!isValidUUID) throw new InvalidFormatUUID();

    const userExists = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) throw new UserNotFound();

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 5);
    startDate.setDate(1);

    const payments = await prismaClient.payment.findMany({
      where: {
        GymClient: {
          ownerId: userId,
        },
        paymentDate: {
          gte: startDate,
        },
      },
    });

    const groupedPayments = payments.reduce((acc, payment) => {
      const dateKey = `${payment.paymentDate.getFullYear()}-${String(
        payment.paymentDate.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!acc[dateKey]) {
        acc[dateKey] = 0;
      }
      acc[dateKey] += payment.amount;

      return acc;
    }, {} as Record<string, number>);

    const result: IOutputGetLastSixPaymentUseCase[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const dateKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      result.push({
        date: dateKey,
        value: groupedPayments[dateKey] || 0,
        month: date.toLocaleString("pt-BR", { month: "short" }),
        year: date.getFullYear(),
      });
    }

    return result;
  }
}
