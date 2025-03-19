"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetLastSixMonthsPaymentController = makeGetLastSixMonthsPaymentController;
const GetLastSixMonthsPaymentsUseCase_1 = require("../../application/useCases/payment/GetLastSixMonthsPaymentsUseCase");
const GetLastSixMonthsPaymentsController_1 = require("../../application/controllers/GetLastSixMonthsPaymentsController");
function makeGetLastSixMonthsPaymentController() {
    const getPaymentsUseCase = new GetLastSixMonthsPaymentsUseCase_1.GetLastSixPaymentUseCase();
    return new GetLastSixMonthsPaymentsController_1.GetLastSixMonthsPaymentsController(getPaymentsUseCase);
}
