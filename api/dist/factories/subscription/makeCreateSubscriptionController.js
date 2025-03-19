"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCreateSubscriptionController = makeCreateSubscriptionController;
const CreateSubscriptionController_1 = require("../../application/controllers/CreateSubscriptionController");
const CreateSubscriptionUseCase_1 = require("../../application/useCases/subscription/CreateSubscriptionUseCase");
function makeCreateSubscriptionController() {
    const createSubscriptionUseCase = new CreateSubscriptionUseCase_1.CreateSubscriptionUseCase();
    return new CreateSubscriptionController_1.CreateSubscriptionController(createSubscriptionUseCase);
}
