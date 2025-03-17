import { GetGymMetricsController } from "../application/controllers/metrics/GetGymMetricsController";
import { AuthenticationMiddleware } from "../application/middlewares/AuthenticationMiddleware";
import { GymClientRepository } from "../application/repositories/GymClientRepository";
import { GetGymMetricsUseCase } from "../application/useCases/metrics/GetGymMetricsUseCase";

export function makeGetMetricsController() {
  const gymClientRepository = new GymClientRepository();
  const getGymMetricsUseCase = new GetGymMetricsUseCase(gymClientRepository);
  return new GetGymMetricsController(getGymMetricsUseCase);
}
