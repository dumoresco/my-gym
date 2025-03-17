import { SubscriptionStatus } from "@prisma/client";
import { prismaClient } from "../../libs/prismaClient";
import { UserNotFound } from "../../errors/UserNotFound";

interface IInputCreateSubscriptionUseCase {
  name: string;
  price: number;
  startDate: Date;
  endDate: Date;
  userId: string;
}

interface IOutputCreateSubscriptionUseCase {
  id: string;
  name: string;
  price: number;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
}

export class CreateSubscriptionUseCase {
  async execute({
    name,
    price,
    startDate,
    endDate,
    userId,
  }: IInputCreateSubscriptionUseCase): Promise<IOutputCreateSubscriptionUseCase> {
    const userExists = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userExists) {
      throw new UserNotFound();
    }

    const subscription = await prismaClient.subscription.create({
      data: {
        name,
        price,
        startDate,
        endDate,
        userId,
        status: "ACTIVE",
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
