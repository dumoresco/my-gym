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
exports.CreateSubscriptionUseCase = void 0;
const prismaClient_1 = require("../../libs/prismaClient");
const UserNotFound_1 = require("../../errors/UserNotFound");
class CreateSubscriptionUseCase {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, price, startDate, endDate, userId, }) {
            const userExists = yield prismaClient_1.prismaClient.user.findUnique({
                where: {
                    id: userId,
                },
            });
            if (!userExists) {
                throw new UserNotFound_1.UserNotFound();
            }
            const subscription = yield prismaClient_1.prismaClient.subscription.create({
                data: {
                    name,
                    price,
                    startDate,
                    endDate,
                    userId,
                    status: "ACTIVE",
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
exports.CreateSubscriptionUseCase = CreateSubscriptionUseCase;
