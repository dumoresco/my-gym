import { SubscriptionStatus } from "@prisma/client";
import { prismaClient } from "../../libs/prismaClient";
import { UserNotFound } from "../../errors/UserNotFound";
import { SubscriptionNotFound } from "../../errors/SubscriptionNotFound";

interface IInputUpdateSubscriptionUseCase {
  subscriptionId: string;
  name: string;
  price: number;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
}

interface IOutputUpdateSubscriptionUseCase {
  id: string;
  name: string;
  price: number;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
}

export class UpdateSubscriptionUseCase {
  async execute({
    name,
    price,
    startDate,
    endDate,
    status,
    subscriptionId,
  }: IInputUpdateSubscriptionUseCase): Promise<IOutputUpdateSubscriptionUseCase> {
    const subscriptionExists = await prismaClient.subscription.findUnique({
      where: {
        id: subscriptionId,
      },
    });

    if (!subscriptionExists) {
      throw new SubscriptionNotFound();
    }

    const subscription = await prismaClient.subscription.update({
      where: {
        id: subscriptionId,
      },
      data: {
        name,
        price,
        startDate,
        endDate,
        status,
      },
    });

    return {
      id: subscription.id,
      name: subscription.name,
      price: subscription.price,
      status: subscription.status,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
    };
  }
}
