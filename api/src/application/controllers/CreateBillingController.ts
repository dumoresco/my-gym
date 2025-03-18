import { z } from "zod";

import { IController, IRequest, IResponse } from "../interfaces/IController";
import { AccountAlreadyExists } from "../errors/AccountAlreadExists";
import { InvalidFormatUUID } from "../errors/InvalidFormatUUID";
import { SubscriptionNotFound } from "../errors/SubscriptionNotFound";
import { CreateGymClientUseCase } from "../useCases/gym-client/CreateGymClientUseCase";
import { CreateBillingUseCase } from "../useCases/charge/CreateBillingUseCase";

export class CreateBillingController implements IController {
  constructor(private readonly createBillingUseCase: CreateBillingUseCase) {}

  async handle({ body }: IRequest): Promise<IResponse> {
    try {
      const { completionUrl, customerId, products, returnUrl } = body;

      if (!customerId || !products || !returnUrl || !completionUrl) {
        return {
          statusCode: 400,
          body: {
            message: "Missing required fields",
          },
        };
      }

      const { url } = await this.createBillingUseCase.execute({
        completionUrl,
        customerId,
        products,
        returnUrl,
      });

      console.log("URL", url);

      return {
        statusCode: 200,
        body: {
          url,
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

      if (err instanceof AccountAlreadyExists) {
        return {
          statusCode: 400,
          body: {
            message: "Gym client already exists",
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
