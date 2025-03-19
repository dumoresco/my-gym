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
exports.GetPaymentUseCase = void 0;
const prismaClient_1 = require("../../libs/prismaClient");
const uuid_1 = require("uuid");
const UserNotFound_1 = require("../../errors/UserNotFound");
const InvalidFormatUUID_1 = require("../../errors/InvalidFormatUUID");
class GetPaymentUseCase {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, }) {
            const isValidUUID = (0, uuid_1.validate)(userId);
            if (!isValidUUID)
                throw new InvalidFormatUUID_1.InvalidFormatUUID();
            const userExists = yield prismaClient_1.prismaClient.user.findUnique({
                where: { id: userId },
            });
            if (!userExists)
                throw new UserNotFound_1.UserNotFound();
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            const payments = yield prismaClient_1.prismaClient.payment.findMany({
                where: {
                    GymClient: {
                        ownerId: userId,
                    },
                    paymentDate: {
                        gte: sixMonthsAgo,
                    },
                },
                orderBy: {
                    paymentDate: "desc",
                },
                take: 5,
                include: {
                    GymClient: true,
                    Subscription: true,
                },
            });
            return payments.map((payment) => ({
                name: payment.GymClient.name,
                email: payment.GymClient.email,
                amount: payment.amount,
                date: payment.paymentDate.toISOString(),
                subscription: {
                    name: payment.Subscription.name,
                },
            }));
        });
    }
}
exports.GetPaymentUseCase = GetPaymentUseCase;
