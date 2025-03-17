import { z } from "zod";

import { IController, IRequest, IResponse } from "../interfaces/IController";
import { InvalidFormatUUID } from "../errors/InvalidFormatUUID";
import { CreateSubscriptionUseCase } from "../useCases/subscription/CreateSubscriptionUseCase";

const schema = z.object({
  name: z.string().min(3),
  price: z.number().positive(),
  startDate: z.string(),
  endDate: z.string(),
});

export class CreateSubscriptionController implements IController {
  constructor(
    private readonly createSubscriptionUseCase: CreateSubscriptionUseCase
  ) {}

  async handle({ body, params }: IRequest): Promise<IResponse> {
    try {
      const { userId } = params;
      const {
        name: subscription_name,
        price: subscription_price,
        startDate: subscription_startDate,
        endDate: subscription_endDate,
      } = schema.parse(body);

      const { id, name, price, status, endDate, startDate } =
        await this.createSubscriptionUseCase.execute({
          name: subscription_name,
          price: subscription_price,
          startDate: new Date(subscription_startDate),
          endDate: new Date(subscription_endDate),
          userId,
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
