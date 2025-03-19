"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeUpdateSubscriptionController = makeUpdateSubscriptionController;
const UpdateSubscriptionController_1 = require("../../application/controllers/UpdateSubscriptionController");
const UpdateSubscriptionUseCase_1 = require("../../application/useCases/subscription/UpdateSubscriptionUseCase");
function makeUpdateSubscriptionController() {
    const updateSubscriptionUseCase = new UpdateSubscriptionUseCase_1.UpdateSubscriptionUseCase();
    return new UpdateSubscriptionController_1.UpdateSubscriptionController(updateSubscriptionUseCase);
}
