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
exports.UpdateGymClientController = void 0;
const zod_1 = require("zod");
const InvalidFormatUUID_1 = require("../errors/InvalidFormatUUID");
const SubscriptionNotFound_1 = require("../errors/SubscriptionNotFound");
const client_1 = require("@prisma/client");
const prismaClient_1 = require("../libs/prismaClient");
const GymClientNotFound_1 = require("../errors/GymClientNotFound");
const schema = zod_1.z.object({
    name: zod_1.z.string().min(3).optional(),
    email: zod_1.z.string().email().optional(),
    phone: zod_1.z.string().optional(),
    subscriptionId: zod_1.z.string().uuid().optional(),
    status: zod_1.z
        .enum([...Object.values(client_1.GymClientStatus)])
        .optional(),
    paymentStatus: zod_1.z
        .enum([...Object.values(client_1.PaymentStatus)])
        .optional(),
});
class UpdateGymClientController {
    constructor(updateGymClientUseCase, createPaymentUseCase) {
        this.updateGymClientUseCase = updateGymClientUseCase;
        this.createPaymentUseCase = createPaymentUseCase;
    }
    handle(_a) {
        return __awaiter(this, arguments, void 0, function* ({ body, params }) {
            try {
                const { clientId } = params;
                const current_client = yield prismaClient_1.prismaClient.gymClient.findUnique({
                    where: {
                        id: clientId,
                    },
                });
                const { email: client_email, name: client_name, phone: client_phone, subscriptionId, status: client_status, paymentStatus: client_paymentStatus, } = schema.parse(body);
                if (!current_client) {
                    return {
                        statusCode: 404,
                        body: {
                            message: "Gym client not found",
                        },
                    };
                }
                const { id, createdAt, email, name, phone, status, updatedAt } = yield this.updateGymClientUseCase.execute({
                    email: client_email || current_client.email,
                    name: client_name || current_client.name,
                    phone: client_phone || current_client.phone,
                    subscriptionId: subscriptionId || current_client.subscriptionId,
                    status: client_status || current_client.status,
                    clientID: current_client.id,
                });
                // pega o valor do subscriptionId do cliente atual
                const subscription = yield prismaClient_1.prismaClient.subscription.findUnique({
                    where: {
                        id: current_client.subscriptionId,
                    },
                });
                if (!subscription) {
                    throw new SubscriptionNotFound_1.SubscriptionNotFound();
                }
                return {
                    statusCode: 200,
                    body: {
                        id,
                        name,
                        email,
                        phone,
                        status,
                        createdAt,
                        updatedAt,
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
                if (err instanceof GymClientNotFound_1.GymClientNotFound) {
                    return {
                        statusCode: 404,
                        body: {
                            message: "Gym client not found",
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
exports.UpdateGymClientController = UpdateGymClientController;
