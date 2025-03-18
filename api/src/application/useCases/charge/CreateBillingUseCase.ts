import { GymClient } from "@prisma/client";
import { prismaClient } from "../../libs/prismaClient";
import { validate as validateUUID } from "uuid";

import { UserNotFound } from "../../errors/UserNotFound";
import { InvalidFormatUUID } from "../../errors/InvalidFormatUUID";
import { GymClientRepository } from "../../repositories/GymClientRepository";
import { SubscriptionNotFound } from "../../errors/SubscriptionNotFound";
import axios from "axios";
interface IInputCreateBillingUseCase {
  products: {
    externalId: string;
    name: string;
    description: string;
    quantity: number;
    price: number;
  }[];
  returnUrl: string;
  completionUrl: string;
  customerId: string;
}

interface IOutputCreateBillingUseCase {
  url: string;
}

export class CreateBillingUseCase {
  constructor() {}

  async execute({
    completionUrl,
    customerId,
    products,
    returnUrl,
  }: IInputCreateBillingUseCase): Promise<IOutputCreateBillingUseCase> {
    // https://api.abacatepay.com/v1/billing/create

    const subscriptionExists = await prismaClient.subscription.findUnique({
      where: {
        id: products[0].externalId,
      },
    });

    if (!subscriptionExists) {
      throw new SubscriptionNotFound();
    }

    // https://api.abacatepay.com/v1/billing/create
    const response = await axios.post(
      "https://api.abacatepay.com/v1/billing/create",
      {
        frequency: "ONE_TIME",
        methods: ["PIX"],
        products: products.map((product) => ({
          externalId: product.externalId,
          name: product.name,
          description: product.description,
          quantity: product.quantity,
          price: product.price,
        })),
        returnUrl,
        completionUrl,
        customerId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ABACATEPAY_API_KEY}`,
        },
      }
    );

    return {
      url: response.data.data.url,
    };
  }
}
