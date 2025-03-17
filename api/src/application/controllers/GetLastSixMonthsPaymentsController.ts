import { z } from "zod";

import { IController, IRequest, IResponse } from "../interfaces/IController";
import { InvalidFormatUUID } from "../errors/InvalidFormatUUID";
import { ListSubscriptionsUseCase } from "../useCases/subscription/GetSubscriptionsUseCase";
import { GetLastSixPaymentUseCase } from "../useCases/payment/GetLastSixMonthsPaymentsUseCase";

export class GetLastSixMonthsPaymentsController implements IController {
  constructor(private readonly getPaymentsUseCase: GetLastSixPaymentUseCase) {}

  async handle({ params }: IRequest): Promise<IResponse> {
    try {
      const { userId } = params;

      const payments = await this.getPaymentsUseCase.execute({
        userId,
      });

      return {
        statusCode: 200,
        body: {
          payments,
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
