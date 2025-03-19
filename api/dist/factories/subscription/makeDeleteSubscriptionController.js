"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeDeleteSubscriptionController = makeDeleteSubscriptionController;
const DeleteSubscriptionController_1 = require("../../application/controllers/DeleteSubscriptionController");
const DeleteSubscriptionUseCase_1 = require("../../application/useCases/subscription/DeleteSubscriptionUseCase");
function makeDeleteSubscriptionController() {
    const deleteSubscriptionUseCase = new DeleteSubscriptionUseCase_1.DeleteSubscriptionUseCase();
    return new DeleteSubscriptionController_1.DeleteSubscriptionController(deleteSubscriptionUseCase);
}
