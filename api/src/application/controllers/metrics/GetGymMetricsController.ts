import { IController, IRequest, IResponse } from "../../interfaces/IController";
import { InvalidFormatUUID } from "../../errors/InvalidFormatUUID";
import { GetGymMetricsUseCase } from "../../useCases/metrics/GetGymMetricsUseCase";

export class GetGymMetricsController implements IController {
  constructor(private readonly getGymMetricsController: GetGymMetricsUseCase) {}

  async handle({ params, query }: IRequest): Promise<IResponse> {
    try {
      const { userId } = params;
      const { month, year } = query;
      const {
        activeClients,
        inactiveClients,
        monthlyRevenue,
        defaultedClients,
      } = await this.getGymMetricsController.execute({
        month,
        year,
        userId,
      });

      return {
        statusCode: 200,
        body: {
          activeClients,
          inactiveClients,
          monthlyRevenue,
          defaultedClients,
        },
      };
    } catch (err) {
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
