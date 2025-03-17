import { SubscriptionStatus } from "@prisma/client";
import { prismaClient } from "../../libs/prismaClient";
import { UserNotFound } from "../../errors/UserNotFound";
import { SubscriptionNotFound } from "../../errors/SubscriptionNotFound";
import { SubscriptionHasClients } from "../../errors/SubscriptionHasClients";

interface IInputDeleteSubscriptionUseCase {
  subscriptionId: string;
}

interface IOutputDeleteSubscriptionUseCase {
  message: string;
}

export class DeleteSubscriptionUseCase {
  async execute({
    subscriptionId,
  }: IInputDeleteSubscriptionUseCase): Promise<IOutputDeleteSubscriptionUseCase> {
    const subscriptionExists = await prismaClient.subscription.findUnique({
      where: {
        id: subscriptionId,
      },
    });

    if (!subscriptionExists) {
      throw new SubscriptionNotFound();
    }

    const gymClients = await prismaClient.gymClient.findMany({
      where: {
        subscriptionId: subscriptionId,
      },
    });

    if (gymClients.length > 0) {
      throw new SubscriptionHasClients();
    }

    await prismaClient.subscription.delete({
      where: {
        id: subscriptionId,
      },
    });

    return {
      message: "Subscription deleted",
    };
  }
}
