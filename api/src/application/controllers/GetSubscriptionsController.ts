import { z } from "zod";

import { IController, IRequest, IResponse } from "../interfaces/IController";
import { InvalidFormatUUID } from "../errors/InvalidFormatUUID";
import { ListSubscriptionsUseCase } from "../useCases/subscription/GetSubscriptionsUseCase";

export class GetSubscriptionsController implements IController {
  constructor(
    private readonly getSubscriptionsUseCase: ListSubscriptionsUseCase
  ) {}

  async handle({ body, params }: IRequest): Promise<IResponse> {
    try {
      const { userId } = params;

      const subscriptions = await this.getSubscriptionsUseCase.execute({
        userId,
      });

      return {
        statusCode: 200,
        body: {
          subscriptions,
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
