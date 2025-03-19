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
exports.CreatePaymentUseCase = void 0;
const prismaClient_1 = require("../../libs/prismaClient");
const UserNotFound_1 = require("../../errors/UserNotFound");
const SubscriptionNotFound_1 = require("../../errors/SubscriptionNotFound");
class CreatePaymentUseCase {
    constructor() { }
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, paymentDate, subscriptionId, value, }) {
            // pega o client pelo abacatePayCustomerId, que é diferente do id do usuario
            const client = yield prismaClient_1.prismaClient.gymClient.findUnique({
                where: {
                    email,
                },
            });
            const subscriptionExists = yield prismaClient_1.prismaClient.subscription.findUnique({
                where: {
                    id: subscriptionId,
                },
            });
            if (!client) {
                throw new UserNotFound_1.UserNotFound();
            }
            if (!subscriptionExists) {
                throw new SubscriptionNotFound_1.SubscriptionNotFound();
            }
            const payment = yield prismaClient_1.prismaClient.payment.create({
                data: {
                    clientId: client.id,
                    amount: value,
                    paymentDate,
                    subscriptionId,
                    status: "PAID",
                },
            });
            return {
                id: payment.id,
                clientId: payment.clientId,
                value: payment.amount,
                paymentDate: payment.paymentDate,
                subscriptionId: payment.subscriptionId,
            };
        });
    }
}
exports.CreatePaymentUseCase = CreatePaymentUseCase;
