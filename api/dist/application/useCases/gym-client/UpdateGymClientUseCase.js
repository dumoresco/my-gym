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
exports.UpdateGymClientUseCase = void 0;
const prismaClient_1 = require("../../libs/prismaClient");
const SubscriptionNotFound_1 = require("../../errors/SubscriptionNotFound");
const GymClientNotFound_1 = require("../../errors/GymClientNotFound");
class UpdateGymClientUseCase {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, email, phone, subscriptionId, clientID, status, }) {
            const gymClientAlreadyExists = yield prismaClient_1.prismaClient.gymClient.findUnique({
                where: {
                    id: clientID,
                },
            });
            const subscriptionExists = yield prismaClient_1.prismaClient.subscription.findUnique({
                where: {
                    id: subscriptionId,
                },
            });
            if (!subscriptionExists) {
                throw new SubscriptionNotFound_1.SubscriptionNotFound();
            }
            if (!gymClientAlreadyExists) {
                throw new GymClientNotFound_1.GymClientNotFound();
            }
            const gymClient = yield prismaClient_1.prismaClient.gymClient.update({
                where: {
                    id: clientID,
                },
                data: {
                    name,
                    email,
                    phone,
                    status,
                    subscriptionId,
                },
            });
            return {
                id: gymClient.id,
                name: gymClient.name,
                email: gymClient.email,
                phone: gymClient.phone,
                status: gymClient.status,
                createdAt: gymClient.createdAt,
                updatedAt: gymClient.updatedAt,
                subscriptionId: gymClient.subscriptionId,
            };
        });
    }
}
exports.UpdateGymClientUseCase = UpdateGymClientUseCase;
