import { listeners } from "process";
import { ListGymClientsController } from "../../application/controllers/ListGymClientsUseCase";
import { GymClientRepository } from "../../application/repositories/GymClientRepository";
import { ListGymClientsUseCase } from "../../application/useCases/gym-client/ListGymClientsUseCase";
import { GetSubscriptionsController } from "../../application/controllers/GetSubscriptionsController";
import { ListSubscriptionsUseCase } from "../../application/useCases/subscription/GetSubscriptionsUseCase";

export function makeGetSubscriptionsController() {
  const getSubscriptionsUseCase = new ListSubscriptionsUseCase();
  return new GetSubscriptionsController(getSubscriptionsUseCase);
}
