"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetPaymentController = makeGetPaymentController;
const GetPaymentsUseCase_1 = require("../../application/useCases/payment/GetPaymentsUseCase");
const GetPaymentsController_1 = require("../../application/controllers/GetPaymentsController");
function makeGetPaymentController() {
    const getPaymentsUseCase = new GetPaymentsUseCase_1.GetPaymentUseCase();
    return new GetPaymentsController_1.GetPaymentsController(getPaymentsUseCase);
}
