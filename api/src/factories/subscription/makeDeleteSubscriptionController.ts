import { CreateSubscriptionController } from "../../application/controllers/CreateSubscriptionController";
import { DeleteSubscriptionController } from "../../application/controllers/DeleteSubscriptionController";
import { CreateSubscriptionUseCase } from "../../application/useCases/subscription/CreateSubscriptionUseCase";
import { DeleteSubscriptionUseCase } from "../../application/useCases/subscription/DeleteSubscriptionUseCase";

export function makeDeleteSubscriptionController() {
  const deleteSubscriptionUseCase = new DeleteSubscriptionUseCase();

  return new DeleteSubscriptionController(deleteSubscriptionUseCase);
}
