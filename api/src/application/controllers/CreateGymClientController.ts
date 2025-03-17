import { z } from "zod";

import { IController, IRequest, IResponse } from "../interfaces/IController";
import { AccountAlreadyExists } from "../errors/AccountAlreadExists";
import { InvalidFormatUUID } from "../errors/InvalidFormatUUID";
import { SubscriptionNotFound } from "../errors/SubscriptionNotFound";
import { CreateGymClientUseCase } from "../useCases/gym-client/CreateGymClientUseCase";

const schema = z.object({
  email: z.string().email(),
  phone: z.string(),
  name: z.string(),
  subscriptionId: z.string().uuid(),
});

export class CreateGymClientController implements IController {
  constructor(
    private readonly createGymClientUseCase: CreateGymClientUseCase
  ) {}

  async handle({ body, params }: IRequest): Promise<IResponse> {
    try {
      const { userId } = params;
      const {
        email: client_email,
        name: client_name,
        phone: client_phone,
        subscriptionId,
      } = schema.parse(body);

      const { id, createdAt, email, name, phone, status, updatedAt } =
        await this.createGymClientUseCase.execute({
          email: client_email,
          name: client_name,
          phone: client_phone,
          userId,
          subscriptionId,
        });

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
