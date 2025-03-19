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
exports.DeleteSubscriptionUseCase = void 0;
const prismaClient_1 = require("../../libs/prismaClient");
const SubscriptionNotFound_1 = require("../../errors/SubscriptionNotFound");
const SubscriptionHasClients_1 = require("../../errors/SubscriptionHasClients");
class DeleteSubscriptionUseCase {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ subscriptionId, }) {
            const subscriptionExists = yield prismaClient_1.prismaClient.subscription.findUnique({
                where: {
                    id: subscriptionId,
                },
            });
            if (!subscriptionExists) {
                throw new SubscriptionNotFound_1.SubscriptionNotFound();
            }
            const gymClients = yield prismaClient_1.prismaClient.gymClient.findMany({
                where: {
                    subscriptionId: subscriptionId,
                },
            });
            if (gymClients.length > 0) {
                throw new SubscriptionHasClients_1.SubscriptionHasClients();
            }
            yield prismaClient_1.prismaClient.subscription.delete({
                where: {
                    id: subscriptionId,
                },
            });
            return {
                message: "Subscription deleted",
            };
        });
    }
}
exports.DeleteSubscriptionUseCase = DeleteSubscriptionUseCase;
