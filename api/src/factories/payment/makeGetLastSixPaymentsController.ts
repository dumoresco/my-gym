import { GetLastSixPaymentUseCase } from "../../application/useCases/payment/GetLastSixMonthsPaymentsUseCase";
import { GetLastSixMonthsPaymentsController } from "../../application/controllers/GetLastSixMonthsPaymentsController";

export function makeGetLastSixMonthsPaymentController() {
  const getPaymentsUseCase = new GetLastSixPaymentUseCase();
  return new GetLastSixMonthsPaymentsController(getPaymentsUseCase);
}
