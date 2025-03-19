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
exports.GetLastSixPaymentUseCase = void 0;
const prismaClient_1 = require("../../libs/prismaClient");
const uuid_1 = require("uuid");
const UserNotFound_1 = require("../../errors/UserNotFound");
const InvalidFormatUUID_1 = require("../../errors/InvalidFormatUUID");
class GetLastSixPaymentUseCase {
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
            const startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 5);
            startDate.setDate(1);
            const payments = yield prismaClient_1.prismaClient.payment.findMany({
                where: {
                    GymClient: {
                        ownerId: userId,
                    },
                    paymentDate: {
                        gte: startDate,
                    },
                },
            });
            const groupedPayments = payments.reduce((acc, payment) => {
                const dateKey = `${payment.paymentDate.getFullYear()}-${String(payment.paymentDate.getMonth() + 1).padStart(2, "0")}`;
                if (!acc[dateKey]) {
                    acc[dateKey] = 0;
                }
                acc[dateKey] += payment.amount;
                return acc;
            }, {});
            const result = [];
            const now = new Date();
            for (let i = 5; i >= 0; i--) {
                const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
                result.push({
                    date: dateKey,
                    value: groupedPayments[dateKey] || 0,
                    month: date.toLocaleString("pt-BR", { month: "short" }),
                    year: date.getFullYear(),
                });
            }
            return result;
        });
    }
}
exports.GetLastSixPaymentUseCase = GetLastSixPaymentUseCase;
