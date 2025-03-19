"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCreateBillingController = makeCreateBillingController;
const CreateBillingUseCase_1 = require("../../application/useCases/charge/CreateBillingUseCase");
const CreateBillingController_1 = require("../../application/controllers/CreateBillingController");
function makeCreateBillingController() {
    const createBillingUseCase = new CreateBillingUseCase_1.CreateBillingUseCase();
    return new CreateBillingController_1.CreateBillingController(createBillingUseCase);
}
