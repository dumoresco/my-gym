"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCreateGymClientController = makeCreateGymClientController;
const CreateGymClientController_1 = require("../../application/controllers/CreateGymClientController");
const CreateGymClientUseCase_1 = require("../../application/useCases/gym-client/CreateGymClientUseCase");
function makeCreateGymClientController() {
    const createGymClientUseCase = new CreateGymClientUseCase_1.CreateGymClientUseCase();
    return new CreateGymClientController_1.CreateGymClientController(createGymClientUseCase);
}
