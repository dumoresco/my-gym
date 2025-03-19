"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetMetricsController = makeGetMetricsController;
const GetGymMetricsController_1 = require("../application/controllers/metrics/GetGymMetricsController");
const GymClientRepository_1 = require("../application/repositories/GymClientRepository");
const GetGymMetricsUseCase_1 = require("../application/useCases/metrics/GetGymMetricsUseCase");
function makeGetMetricsController() {
    const gymClientRepository = new GymClientRepository_1.GymClientRepository();
    const getGymMetricsUseCase = new GetGymMetricsUseCase_1.GetGymMetricsUseCase(gymClientRepository);
    return new GetGymMetricsController_1.GetGymMetricsController(getGymMetricsUseCase);
}
