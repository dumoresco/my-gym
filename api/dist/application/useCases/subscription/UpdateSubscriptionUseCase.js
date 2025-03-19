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
exports.UpdateSubscriptionUseCase = void 0;
const prismaClient_1 = require("../../libs/prismaClient");
const SubscriptionNotFound_1 = require("../../errors/SubscriptionNotFound");
class UpdateSubscriptionUseCase {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, price, startDate, endDate, status, subscriptionId, }) {
            const subscriptionExists = yield prismaClient_1.prismaClient.subscription.findUnique({
                where: {
                    id: subscriptionId,
                },
            });
            if (!subscriptionExists) {
                throw new SubscriptionNotFound_1.SubscriptionNotFound();
            }
            const subscription = yield prismaClient_1.prismaClient.subscription.update({
                where: {
                    id: subscriptionId,
                },
                data: {
                    name,
                    price,
                    startDate,
                    endDate,
                    status,
                },
            });
            return {
                id: subscription.id,
                name: subscription.name,
                price: subscription.price,
                status: subscription.status,
                startDate: subscription.startDate,
                endDate: subscription.endDate,
            };
        });
    }
}
exports.UpdateSubscriptionUseCase = UpdateSubscriptionUseCase;
