import { z } from "zod";

import { IController, IRequest, IResponse } from "../interfaces/IController";
import { InvalidFormatUUID } from "../errors/InvalidFormatUUID";
import { CreateSubscriptionUseCase } from "../useCases/subscription/CreateSubscriptionUseCase";
import { DeleteSubscriptionUseCase } from "../useCases/subscription/DeleteSubscriptionUseCase";
import { SubscriptionNotFound } from "../errors/SubscriptionNotFound";
import { SubscriptionHasClients } from "../errors/SubscriptionHasClients";

export class DeleteSubscriptionController implements IController {
  constructor(
    private readonly deleteSubscriptionUseCase: DeleteSubscriptionUseCase
  ) {}

  async handle({ params }: IRequest): Promise<IResponse> {
    try {
      const { subscriptionId } = params;

      await this.deleteSubscriptionUseCase.execute({
        subscriptionId,
      });

      return {
        statusCode: 200,
        body: {
          message: "Subscription deleted",
        },
      };
    } catch (err) {
      if (err instanceof SubscriptionNotFound) {
        return {
          statusCode: 404,
          body: {
            message: "Subscription not found",
          },
        };
      }

      if (err instanceof SubscriptionHasClients) {
        return {
          statusCode: 400,
          body: {
            message: "Subscription has clients",
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
