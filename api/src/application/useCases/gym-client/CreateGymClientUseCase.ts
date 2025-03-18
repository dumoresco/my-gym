import { PrismaClient } from "@prisma/client";

import { validate as validateUUID } from "uuid";
import { InvalidFormatUUID } from "../../errors/InvalidFormatUUID";
import { prismaClient } from "../../libs/prismaClient";
import { UserNotFound } from "../../errors/UserNotFound";
import { SubscriptionNotFound } from "../../errors/SubscriptionNotFound";
import { AccountAlreadyExists } from "../../errors/AccountAlreadExists";
import axios from "axios";

interface IInputCreateGymClientUseCase {
  name: string;
  email: string;
  phone: string;
  userId: string;
  subscriptionId: string;
  taxId: string;
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
  taxId: string;
  abacatePayCustomerId?: string;
}

export class CreateGymClientUseCase {
  async execute({
    name,
    email,
    phone,
    userId,
    subscriptionId,
    taxId,
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

    // formata o taxId para 123.456.789-01
    const formattedTaxId = taxId.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      "$1.$2.$3-$4"
    );
    // cria o client no abacate pay
    const response = await axios.post(
      "https://api.abacatepay.com/v1/customer/create",
      {
        name: name,
        email: email,
        cellphone: phone,
        taxId: formattedTaxId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ABACATEPAY_API_KEY}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Error creating client on Abacate Pay");
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
        taxId,
        abacatePayCustomerId: response.data.data.id,
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
      taxId: gymClient.taxId,
      abacatePayCustomerId: gymClient.abacatePayCustomerId ?? undefined,
    };
  }
}
