import { CreateSubscriptionController } from "../../application/controllers/CreateSubscriptionController";
import { CreateSubscriptionUseCase } from "../../application/useCases/subscription/CreateSubscriptionUseCase";

export function makeCreateSubscriptionController() {
  const createSubscriptionUseCase = new CreateSubscriptionUseCase();

  return new CreateSubscriptionController(createSubscriptionUseCase);
}
