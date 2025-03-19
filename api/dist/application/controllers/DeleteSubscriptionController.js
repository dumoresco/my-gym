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
exports.DeleteSubscriptionController = void 0;
const InvalidFormatUUID_1 = require("../errors/InvalidFormatUUID");
const SubscriptionNotFound_1 = require("../errors/SubscriptionNotFound");
const SubscriptionHasClients_1 = require("../errors/SubscriptionHasClients");
class DeleteSubscriptionController {
    constructor(deleteSubscriptionUseCase) {
        this.deleteSubscriptionUseCase = deleteSubscriptionUseCase;
    }
    handle(_a) {
        return __awaiter(this, arguments, void 0, function* ({ params }) {
            try {
                const { subscriptionId } = params;
                yield this.deleteSubscriptionUseCase.execute({
                    subscriptionId,
                });
                return {
                    statusCode: 200,
                    body: {
                        message: "Subscription deleted",
                    },
                };
            }
            catch (err) {
                if (err instanceof SubscriptionNotFound_1.SubscriptionNotFound) {
                    return {
                        statusCode: 404,
                        body: {
                            message: "Subscription not found",
                        },
                    };
                }
                if (err instanceof SubscriptionHasClients_1.SubscriptionHasClients) {
                    return {
                        statusCode: 400,
                        body: {
                            message: "Subscription has clients",
                        },
                    };
                }
                if (err instanceof InvalidFormatUUID_1.InvalidFormatUUID) {
                    return {
                        statusCode: 400,
                        body: {
                            message: "Invalid userId format. It must be a valid UUID.",
                        },
                    };
                }
                throw err;
            }
        });
    }
}
exports.DeleteSubscriptionController = DeleteSubscriptionController;
