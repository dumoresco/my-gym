import { SubscriptionStatus } from "@prisma/client";
import { prismaClient } from "../../libs/prismaClient";
import { UserNotFound } from "../../errors/UserNotFound";

interface IInputListSubscriptionsUseCase {
  userId: string;
}

interface IOutputListSubscriptionsUseCase {
  id: string;
  name: string;
  price: number;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
}

export class ListSubscriptionsUseCase {
  async execute({
    userId,
  }: IInputListSubscriptionsUseCase): Promise<
    IOutputListSubscriptionsUseCase[]
  > {
    const userExists = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userExists) {
      throw new UserNotFound();
    }

    const subscriptions = await prismaClient.subscription.findMany({
      where: {
        userId: userExists.id,
      },
    });

    return subscriptions.map((subscription) => ({
      id: subscription.id,
      name: subscription.name,
      price: subscription.price,
      status: subscription.status,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
    }));
  }
}
