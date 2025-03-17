import { z } from "zod";

import { IController, IRequest, IResponse } from "../interfaces/IController";
import { InvalidFormatUUID } from "../errors/InvalidFormatUUID";
import { GetPaymentUseCase } from "../useCases/payment/GetPaymentsUseCase";

export class GetPaymentsController implements IController {
  constructor(private readonly getPaymentsUseCase: GetPaymentUseCase) {}

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
