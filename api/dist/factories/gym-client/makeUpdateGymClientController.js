"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeUpdateGymClientController = makeUpdateGymClientController;
const UpdateGymClientController_1 = require("../../application/controllers/UpdateGymClientController");
const UpdateGymClientUseCase_1 = require("../../application/useCases/gym-client/UpdateGymClientUseCase");
const CreatePaymentUseCase_1 = require("../../application/useCases/payment/CreatePaymentUseCase");
function makeUpdateGymClientController() {
    const updateGymClientUseCase = new UpdateGymClientUseCase_1.UpdateGymClientUseCase();
    const createPaymentUseCase = new CreatePaymentUseCase_1.CreatePaymentUseCase();
    return new UpdateGymClientController_1.UpdateGymClientController(updateGymClientUseCase, createPaymentUseCase);
}
