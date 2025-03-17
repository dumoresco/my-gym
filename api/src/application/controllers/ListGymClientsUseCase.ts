import { z } from "zod";

import { IController, IRequest, IResponse } from "../interfaces/IController";
import { UserNotFound } from "../errors/UserNotFound";
import { SubscriptionNotFound } from "../errors/SubscriptionNotFound";
import { ListGymClientsUseCase } from "../useCases/gym-client/ListGymClientsUseCase";

const schema = z.object({
  userId: z.string(),
});

export class ListGymClientsController implements IController {
  constructor(private readonly listGymClientsUseCase: ListGymClientsUseCase) {}

  async handle({ params }: IRequest): Promise<IResponse> {
    try {
      const { userId } = params;
      schema.parse({ userId });

      const gymClients = await this.listGymClientsUseCase.execute(userId);
      return {
        statusCode: 200,
        body: {
          gymClients,
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

      if (err instanceof UserNotFound) {
        return {
          statusCode: 404,
          body: {
            message: "User not found",
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
