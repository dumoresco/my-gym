import { UpdateSubscriptionController } from "../../application/controllers/UpdateSubscriptionController";
import { UpdateSubscriptionUseCase } from "../../application/useCases/subscription/UpdateSubscriptionUseCase";

export function makeUpdateSubscriptionController() {
  const updateSubscriptionUseCase = new UpdateSubscriptionUseCase();

  return new UpdateSubscriptionController(updateSubscriptionUseCase);
}
