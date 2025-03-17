import { z } from "zod";

import { IController, IRequest, IResponse } from "../interfaces/IController";
import { InvalidFormatUUID } from "../errors/InvalidFormatUUID";
import { CreateSubscriptionUseCase } from "../useCases/subscription/CreateSubscriptionUseCase";
import { UpdateSubscriptionUseCase } from "../useCases/subscription/UpdateSubscriptionUseCase";
import { prismaClient } from "../libs/prismaClient";
import { SubscriptionStatus } from "@prisma/client";
import { SubscriptionNotFound } from "../errors/SubscriptionNotFound";

const schema = z.object({
  name: z.string().min(3).optional(),
  price: z.number().positive().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z
    .enum([...Object.values(SubscriptionStatus)] as [string, ...string[]])
    .optional(),
});

export class UpdateSubscriptionController implements IController {
  constructor(
    private readonly updateSubscriptionUseCase: UpdateSubscriptionUseCase
  ) {}

  async handle({ body, params }: IRequest): Promise<IResponse> {
    try {
      const { subscriptionId } = params;
      const current_subscription = await prismaClient.subscription.findUnique({
        where: {
          id: subscriptionId,
        },
      });

      const {
        name: subscription_name,
        price: subscription_price,
        startDate: subscription_startDate,
        endDate: subscription_endDate,
        status: subscription_status,
      } = schema.parse(body);

      if (!current_subscription) {
        return {
          statusCode: 404,
          body: {
            message: "Subscription not found",
          },
        };
      }

      const { id, name, price, status, endDate, startDate } =
        await this.updateSubscriptionUseCase.execute({
          name: subscription_name || current_subscription.name,
          price: subscription_price || current_subscription.price,
          startDate: subscription_startDate
            ? new Date(subscription_startDate)
            : current_subscription.startDate,
          endDate: subscription_endDate
            ? new Date(subscription_endDate)
            : current_subscription.endDate,
          status:
            (subscription_status as SubscriptionStatus) ||
            current_subscription.status,
          subscriptionId,
        });

      return {
        statusCode: 200,
        body: {
          id,
          name,
          price,
          status,
          startDate,
          endDate,
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

      if (err instanceof SubscriptionNotFound) {
        return {
          statusCode: 404,
          body: {
            message: "Subscription not found",
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

      throw err;
    }
  }
}
