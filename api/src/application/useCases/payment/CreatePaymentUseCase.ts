import { GymClient } from "@prisma/client";
import { prismaClient } from "../../libs/prismaClient";
import { validate as validateUUID } from "uuid";

import { UserNotFound } from "../../errors/UserNotFound";
import { InvalidFormatUUID } from "../../errors/InvalidFormatUUID";
import { GymClientRepository } from "../../repositories/GymClientRepository";
import { SubscriptionNotFound } from "../../errors/SubscriptionNotFound";
interface IInputCreatePaymentUseCase {
  email: string;
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
    email,
    paymentDate,
    subscriptionId,
    value,
  }: IInputCreatePaymentUseCase): Promise<IOutputCreatePaymentUseCase> {
    // pega o client pelo abacatePayCustomerId, que é diferente do id do usuario
    const client = await prismaClient.gymClient.findUnique({
      where: {
        email,
      },
    });

    const subscriptionExists = await prismaClient.subscription.findUnique({
      where: {
        id: subscriptionId,
      },
    });

    if (!client) {
      throw new UserNotFound();
    }

    if (!subscriptionExists) {
      throw new SubscriptionNotFound();
    }

    const payment = await prismaClient.payment.create({
      data: {
        clientId: client.id,
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
