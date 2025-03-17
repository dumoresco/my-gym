import { UpdateGymClientController } from "../../application/controllers/UpdateGymClientController";
import { UpdateGymClientUseCase } from "../../application/useCases/gym-client/UpdateGymClientUseCase";
import { CreatePaymentUseCase } from "../../application/useCases/payment/CreatePaymentUseCase";

export function makeUpdateGymClientController() {
  const updateGymClientUseCase = new UpdateGymClientUseCase();
  const createPaymentUseCase = new CreatePaymentUseCase();

  return new UpdateGymClientController(
    updateGymClientUseCase,
    createPaymentUseCase
  );
}
