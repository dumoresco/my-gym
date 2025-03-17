import { GymClient } from "@prisma/client";
import { prismaClient } from "../../libs/prismaClient";
import { validate as validateUUID } from "uuid";

import { UserNotFound } from "../../errors/UserNotFound";
import { InvalidFormatUUID } from "../../errors/InvalidFormatUUID";
import { GymClientRepository } from "../../repositories/GymClientRepository";
import { SubscriptionNotFound } from "../../errors/SubscriptionNotFound";
interface IInputCreatePaymentUseCase {
  clientId: string;
  value: number;
  paymentDate: Date;
  subscriptionId: string;
}

interface IOutputCreatePaymentUseCase {
  id: string;
  clientId: string;
  value: number;
  paymentDate: Date;
  subscriptionId: string;
}

export class CreatePaymentUseCase {
  constructor() {}

  async execute({
    clientId,
    paymentDate,
    subscriptionId,
    value,
  }: IInputCreatePaymentUseCase): Promise<IOutputCreatePaymentUseCase> {
    const isValidUUID = validateUUID(clientId);

    if (!isValidUUID) {
      throw new InvalidFormatUUID();
    }

    const userExists = await prismaClient.gymClient.findUnique({
      where: {
        id: clientId,
      },
    });

    const subscriptionExists = await prismaClient.subscription.findUnique({
      where: {
        id: subscriptionId,
      },
    });

    if (!userExists) {
      throw new UserNotFound();
    }

    if (!subscriptionExists) {
      throw new SubscriptionNotFound();
    }

    const payment = await prismaClient.payment.create({
      data: {
        clientId,
        amount: value,
        paymentDate,
        subscriptionId,
        status: "PAID",
      },
    });

    return {
      id: payment.id,
      clientId: payment.clientId,
      value: payment.amount,
      paymentDate: payment.paymentDate,
      subscriptionId: payment.subscriptionId,
    };
  }
}
