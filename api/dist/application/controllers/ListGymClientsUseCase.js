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
exports.ListGymClientsController = void 0;
const zod_1 = require("zod");
const UserNotFound_1 = require("../errors/UserNotFound");
const SubscriptionNotFound_1 = require("../errors/SubscriptionNotFound");
const schema = zod_1.z.object({
    userId: zod_1.z.string(),
});
class ListGymClientsController {
    constructor(listGymClientsUseCase) {
        this.listGymClientsUseCase = listGymClientsUseCase;
    }
    handle(_a) {
        return __awaiter(this, arguments, void 0, function* ({ params }) {
            try {
                const { userId } = params;
                schema.parse({ userId });
                const gymClients = yield this.listGymClientsUseCase.execute(userId);
                return {
                    statusCode: 200,
                    body: {
                        gymClients,
                    },
                };
            }
            catch (err) {
                if (err instanceof zod_1.z.ZodError) {
                    return {
                        statusCode: 400,
                        body: {
                            message: err.issues,
                        },
                    };
                }
                if (err instanceof UserNotFound_1.UserNotFound) {
                    return {
                        statusCode: 404,
                        body: {
                            message: "User not found",
                        },
                    };
                }
                if (err instanceof SubscriptionNotFound_1.SubscriptionNotFound) {
                    return {
                        statusCode: 404,
                        body: {
                            message: "Subscription not found",
                        },
                    };
                }
                throw err;
            }
        });
    }
}
exports.ListGymClientsController = ListGymClientsController;
