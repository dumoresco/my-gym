"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetGymMetricsController = void 0;
const InvalidFormatUUID_1 = require("../../errors/InvalidFormatUUID");
const UserNotFound_1 = require("../../errors/UserNotFound");
class GetGymMetricsController {
    constructor(getGymMetricsController) {
        this.getGymMetricsController = getGymMetricsController;
    }
    handle(_a) {
        return __awaiter(this, arguments, void 0, function* ({ params, query }) {
            try {
                const { userId } = params;
                const { month, year } = query;
                const { activeClients, inactiveClients, monthlyRevenue, defaultedClients, } = yield this.getGymMetricsController.execute({
                    month,
                    year,
                    userId,
                });
                return {
                    statusCode: 200,
                    body: {
                        activeClients,
                        inactiveClients,
                        monthlyRevenue,
                        defaultedClients,
                    },
                };
            }
            catch (err) {
                if (err instanceof InvalidFormatUUID_1.InvalidFormatUUID) {
                    return {
                        statusCode: 400,
                        body: {
                            message: "Invalid userId format. It must be a valid UUID.",
                        },
                    };
                }
                if (err instanceof UserNotFound_1.UserNotFound) {
                    return {
                        statusCode: 404,
                        body: {
                            message: "User not found.",
                        },
                    };
                }
                throw err;
            }
        });
    }
}
exports.GetGymMetricsController = GetGymMetricsController;
