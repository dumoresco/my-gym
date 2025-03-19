"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetAllGymClientsController = makeGetAllGymClientsController;
const GymClientRepository_1 = require("../../application/repositories/GymClientRepository");
const ListGymClientsUseCase_1 = require("../../application/useCases/gym-client/ListGymClientsUseCase");
const ListGymClientsUseCase_2 = require("../../application/controllers/ListGymClientsUseCase");
function makeGetAllGymClientsController() {
    const gymClientsRepository = new GymClientRepository_1.GymClientRepository();
    const listGymClientsUseCase = new ListGymClientsUseCase_1.ListGymClientsUseCase(gymClientsRepository);
    return new ListGymClientsUseCase_2.ListGymClientsController(listGymClientsUseCase);
}
