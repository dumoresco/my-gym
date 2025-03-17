import { PrismaClient } from "@prisma/client";

import { validate as validateUUID } from "uuid";
import { InvalidFormatUUID } from "../../errors/InvalidFormatUUID";
import { prismaClient } from "../../libs/prismaClient";
import { UserNotFound } from "../../errors/UserNotFound";
import { SubscriptionNotFound } from "../../errors/SubscriptionNotFound";
import { AccountAlreadyExists } from "../../errors/AccountAlreadExists";

interface IInputCreateGymClientUseCase {
  name: string;
  email: string;
  phone: string;
  userId: string;
  subscriptionId: string;
}

interface IOutputCreateGymClientUseCase {
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

export class CreateGymClientUseCase {
  async execute({
    name,
    email,
    phone,
    userId,
    subscriptionId,
  }: IInputCreateGymClientUseCase): Promise<IOutputCreateGymClientUseCase> {
    const isValidUUID = validateUUID(userId);

    if (!isValidUUID) {
      throw new InvalidFormatUUID();
    }

    const userExists = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userExists) {
      throw new UserNotFound();
    }

    const gymClientAlreadyExists = await prismaClient.gymClient.findUnique({
      where: {
        email,
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

    if (gymClientAlreadyExists) {
      throw new AccountAlreadyExists();
    }

    const gymClient = await prismaClient.gymClient.create({
      data: {
        name,
        email,
        phone,
        ownerId: userId,
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
        subscriptionId,
        paymentStatus: "UNPAID",
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
