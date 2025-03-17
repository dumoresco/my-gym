import { listeners } from "process";
import { GymClientRepository } from "../../application/repositories/GymClientRepository";
import { ListGymClientsUseCase } from "../../application/useCases/gym-client/ListGymClientsUseCase";
import { ListGymClientsController } from "../../application/controllers/ListGymClientsUseCase";

export function makeGetAllGymClientsController() {
  const gymClientsRepository = new GymClientRepository();
  const listGymClientsUseCase = new ListGymClientsUseCase(gymClientsRepository);

  return new ListGymClientsController(listGymClientsUseCase);
}
