import { z } from "zod";

import { IController, IRequest, IResponse } from "../interfaces/IController";
import { AccountAlreadyExists } from "../errors/AccountAlreadExists";
import { InvalidFormatUUID } from "../errors/InvalidFormatUUID";
import { SubscriptionNotFound } from "../errors/SubscriptionNotFound";
import { CreateGymClientUseCase } from "../useCases/gym-client/CreateGymClientUseCase";
import { UpdateGymClientUseCase } from "../useCases/gym-client/UpdateGymClientUseCase";
import { GymClientStatus, PaymentStatus } from "@prisma/client";
import { prismaClient } from "../libs/prismaClient";
import { GymClientNotFound } from "../errors/GymClientNotFound";
import { CreatePaymentUseCase } from "../useCases/payment/CreatePaymentUseCase";

const schema = z.object({
  name: z.string().min(3).optional(),

  email: z.string().email().optional(),
  phone: z.string().optional(),
  subscriptionId: z.string().uuid().optional(),
  status: z
    .enum([...Object.values(GymClientStatus)] as [string, ...string[]])
    .optional(),
  paymentStatus: z
    .enum([...Object.values(PaymentStatus)] as [string, ...string[]])
    .optional(),
});

export class UpdateGymClientController implements IController {
  constructor(
    private readonly updateGymClientUseCase: UpdateGymClientUseCase,
    private readonly createPaymentUseCase: CreatePaymentUseCase
  ) {}

  async handle({ body, params }: IRequest): Promise<IResponse> {
    try {
      const { clientId } = params;

      const current_client = await prismaClient.gymClient.findUnique({
        where: {
          id: clientId,
        },
      });

      const {
        email: client_email,
        name: client_name,
        phone: client_phone,
        subscriptionId,
        status: client_status,
        paymentStatus: client_paymentStatus,
      } = schema.parse(body);

      if (!current_client) {
        return {
          statusCode: 404,
          body: {
            message: "Gym client not found",
          },
        };
      }

      const { id, createdAt, email, name, phone, status, updatedAt } =
        await this.updateGymClientUseCase.execute({
          email: client_email || current_client.email,
          name: client_name || current_client.name,
          phone: client_phone || current_client.phone,
          subscriptionId: subscriptionId || current_client.subscriptionId,
          status: (client_status as GymClientStatus) || current_client.status,
          clientID: current_client.id,
          paymentStatus:
            (client_paymentStatus as PaymentStatus) ||
            current_client.paymentStatus,
        });

      // pega o valor do subscriptionId do cliente atual
      const subscription = await prismaClient.subscription.findUnique({
        where: {
          id: current_client.subscriptionId,
        },
      });

      if (!subscription) {
        throw new SubscriptionNotFound();
      }

      if (
        client_paymentStatus === "PAID" &&
        current_client.paymentStatus !== "PAID"
      ) {
        await this.createPaymentUseCase.execute({
          clientId: current_client.id,
          value: subscription.price,
          paymentDate: new Date(),
          subscriptionId: current_client.subscriptionId,
        });
      }

      return {
        statusCode: 200,
        body: {
          id,
          name,
          email,
          phone,
          status,
          createdAt,
          updatedAt,
          paymentStatus: client_paymentStatus || PaymentStatus.PAID,
        },
      };
    } catch (err) {
      if (err instanceof z.ZodError) {
        return {
          statusCode: 400,
          body: {
            message: err.issues,
          },
        };
      }

      if (err instanceof GymClientNotFound) {
        return {
          statusCode: 404,
          body: {
            message: "Gym client not found",
          },
        };
      }

      if (err instanceof InvalidFormatUUID) {
        return {
          statusCode: 400,
          body: {
            message: "Invalid userId format. It must be a valid UUID.",
          },
        };
      }

      if (err instanceof SubscriptionNotFound) {
        return {
          statusCode: 404,
          body: {
            message: "Subscription not found",
          },
        };
      }

      throw err;
    }
  }
}
