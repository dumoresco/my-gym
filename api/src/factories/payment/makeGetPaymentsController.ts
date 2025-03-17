import { GetLastSixPaymentUseCase } from "../../application/useCases/payment/GetLastSixMonthsPaymentsUseCase";
import { GetLastSixMonthsPaymentsController } from "../../application/controllers/GetLastSixMonthsPaymentsController";
import { GetPaymentUseCase } from "../../application/useCases/payment/GetPaymentsUseCase";
import { GetPaymentsController } from "../../application/controllers/GetPaymentsController";

export function makeGetPaymentController() {
  const getPaymentsUseCase = new GetPaymentUseCase();
  return new GetPaymentsController(getPaymentsUseCase);
}
