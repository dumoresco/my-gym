import { GetLastSixPaymentUseCase } from "../../application/useCases/payment/GetLastSixMonthsPaymentsUseCase";
import { GetLastSixMonthsPaymentsController } from "../../application/controllers/GetLastSixMonthsPaymentsController";
import { GetPaymentUseCase } from "../../application/useCases/payment/GetPaymentsUseCase";
import { GetPaymentsController } from "../../application/controllers/GetPaymentsController";
import { CreateBillingUseCase } from "../../application/useCases/charge/CreateBillingUseCase";
import { CreateBillingController } from "../../application/controllers/CreateBillingController";

export function makeCreateBillingController() {
  const createBillingUseCase = new CreateBillingUseCase();
  return new CreateBillingController(createBillingUseCase);
}
