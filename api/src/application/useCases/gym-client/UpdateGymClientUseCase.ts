import { GymClientStatus, PaymentStatus } from "@prisma/client";

import { prismaClient } from "../../libs/prismaClient";
import { SubscriptionNotFound } from "../../errors/SubscriptionNotFound";
import { GymClientNotFound } from "../../errors/GymClientNotFound";

interface IInputUpdateGymClientUseCase {
  name: string;
  email: string;
  phone: string;
  status: GymClientStatus;
  clientID: string;
  subscriptionId: string;
}

interface IOutputUpdateGymClientUseCase {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  inactiveAt?: Date;
  subscriptionId: string;
}

export class UpdateGymClientUseCase {
  async execute({
    name,
    email,
    phone,
    subscriptionId,
    clientID,
    status,
  }: IInputUpdateGymClientUseCase): Promise<IOutputUpdateGymClientUseCase> {
    const gymClientAlreadyExists = await prismaClient.gymClient.findUnique({
      where: {
        id: clientID,
      },
    });
    const subscriptionExists = await prismaClient.subscription.findUnique({
      where: {
        id: subscriptionId,
      },
    });

    if (!subscriptionExists) {
      throw new SubscriptionNotFound();
    }

    if (!gymClientAlreadyExists) {
      throw new GymClientNotFound();
    }

    const gymClient = await prismaClient.gymClient.update({
      where: {
        id: clientID,
      },
      data: {
        name,
        email,
        phone,
        status,
        subscriptionId,
      },
    });
    return {
      id: gymClient.id,
      name: gymClient.name,
      email: gymClient.email,
      phone: gymClient.phone,
      status: gymClient.status,
      createdAt: gymClient.createdAt,
      updatedAt: gymClient.updatedAt,
      subscriptionId: gymClient.subscriptionId,
    };
  }
}
