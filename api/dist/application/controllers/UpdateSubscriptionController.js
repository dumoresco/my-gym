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
exports.UpdateSubscriptionController = void 0;
const zod_1 = require("zod");
const InvalidFormatUUID_1 = require("../errors/InvalidFormatUUID");
const prismaClient_1 = require("../libs/prismaClient");
const client_1 = require("@prisma/client");
const SubscriptionNotFound_1 = require("../errors/SubscriptionNotFound");
const schema = zod_1.z.object({
    name: zod_1.z.string().min(3).optional(),
    price: zod_1.z.number().positive().optional(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    status: zod_1.z
        .enum([...Object.values(client_1.SubscriptionStatus)])
        .optional(),
});
class UpdateSubscriptionController {
    constructor(updateSubscriptionUseCase) {
        this.updateSubscriptionUseCase = updateSubscriptionUseCase;
    }
    handle(_a) {
        return __awaiter(this, arguments, void 0, function* ({ body, params }) {
            try {
                const { subscriptionId } = params;
                const current_subscription = yield prismaClient_1.prismaClient.subscription.findUnique({
                    where: {
                        id: subscriptionId,
                    },
                });
                const { name: subscription_name, price: subscription_price, startDate: subscription_startDate, endDate: subscription_endDate, status: subscription_status, } = schema.parse(body);
                if (!current_subscription) {
                    return {
                        statusCode: 404,
                        body: {
                            message: "Subscription not found",
                        },
                    };
                }
                const { id, name, price, status, endDate, startDate } = yield this.updateSubscriptionUseCase.execute({
                    name: subscription_name || current_subscription.name,
                    price: subscription_price || current_subscription.price,
                    startDate: subscription_startDate
                        ? new Date(subscription_startDate)
                        : current_subscription.startDate,
                    endDate: subscription_endDate
                        ? new Date(subscription_endDate)
                        : current_subscription.endDate,
                    status: subscription_status ||
                        current_subscription.status,
                    subscriptionId,
                });
                return {
                    statusCode: 200,
                    body: {
                        id,
                        name,
                        price,
                        status,
                        startDate,
                        endDate,
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
                if (err instanceof SubscriptionNotFound_1.SubscriptionNotFound) {
                    return {
                        statusCode: 404,
                        body: {
                            message: "Subscription not found",
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
exports.UpdateSubscriptionController = UpdateSubscriptionController;
