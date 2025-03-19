"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetSubscriptionsController = makeGetSubscriptionsController;
const GetSubscriptionsController_1 = require("../../application/controllers/GetSubscriptionsController");
const GetSubscriptionsUseCase_1 = require("../../application/useCases/subscription/GetSubscriptionsUseCase");
function makeGetSubscriptionsController() {
    const getSubscriptionsUseCase = new GetSubscriptionsUseCase_1.ListSubscriptionsUseCase();
    return new GetSubscriptionsController_1.GetSubscriptionsController(getSubscriptionsUseCase);
}
