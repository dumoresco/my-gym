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
exports.checkPayments = checkPayments;
const date_fns_1 = require("date-fns");
const prismaClient_1 = require("../application/libs/prismaClient");
function checkPayments() {
    return __awaiter(this, void 0, void 0, function* () {
        const users = yield prismaClient_1.prismaClient.gymClient.findMany({
            where: {
                paymentStatus: {
                    equals: "PAID",
                },
            },
        });
        for (const user of users) {
            const lastPaymentDate = (user === null || user === void 0 ? void 0 : user.subscriptionLastPayment)
                ? new Date(user.subscriptionLastPayment)
                : new Date();
            const nextPaymentDate = (0, date_fns_1.addMonths)(lastPaymentDate, 1);
            if (new Date() >= nextPaymentDate) {
                yield prismaClient_1.prismaClient.gymClient.update({
                    where: { id: user.id },
                    data: { paymentStatus: "UNPAID" },
                });
            }
        }
    });
}
