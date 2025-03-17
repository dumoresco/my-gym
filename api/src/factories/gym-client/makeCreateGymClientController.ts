import { CreateGymClientController } from "../../application/controllers/CreateGymClientController";
import { CreateGymClientUseCase } from "../../application/useCases/gym-client/CreateGymClientUseCase";

export function makeCreateGymClientController() {
  const createGymClientUseCase = new CreateGymClientUseCase();

  return new CreateGymClientController(createGymClientUseCase);
}
