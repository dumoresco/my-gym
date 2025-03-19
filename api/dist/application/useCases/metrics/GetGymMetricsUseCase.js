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
exports.GetGymMetricsUseCase = void 0;
const prismaClient_1 = require("../../libs/prismaClient");
const uuid_1 = require("uuid");
const UserNotFound_1 = require("../../errors/UserNotFound");
const InvalidFormatUUID_1 = require("../../errors/InvalidFormatUUID");
class GetGymMetricsUseCase {
    constructor(gymClientRepository) {
        this.gymClientRepository = gymClientRepository;
    }
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, month, year, }) {
            const isValidUUID = (0, uuid_1.validate)(userId);
            if (!isValidUUID) {
                throw new InvalidFormatUUID_1.InvalidFormatUUID();
            }
            const userExists = yield prismaClient_1.prismaClient.user.findUnique({
                where: {
                    id: userId,
                },
            });
            if (!userExists) {
                throw new UserNotFound_1.UserNotFound();
            }
            const gymClients = yield this.gymClientRepository.findByUserId(userId);
            const activeClients = gymClients.filter((client) => client.status === "ACTIVE");
            const inactiveClients = gymClients.filter((client) => client.status === "INACTIVE" || client.status === "SUSPENDED").length;
            const monthlyRevenue = yield this.calculateMonthlyRevenue(activeClients, month, year);
            const inadimplentes = yield this.calculateInadimplentes(activeClients, month, year);
            return {
                activeClients: activeClients.length,
                inactiveClients,
                monthlyRevenue: monthlyRevenue,
                defaultedClients: inadimplentes,
            };
        });
    }
    calculateMonthlyRevenue(activeClients, month, year) {
        return __awaiter(this, void 0, void 0, function* () {
            let revenue = 0;
            for (const client of activeClients) {
                const lastPaymentDate = client.subscriptionLastPayment;
                console.log("lastPaymentDate", lastPaymentDate);
                if (lastPaymentDate) {
                    const paymentDate = new Date(lastPaymentDate);
                    if (paymentDate.getMonth() + 1 == month &&
                        paymentDate.getFullYear() == year) {
                        const subscription = yield prismaClient_1.prismaClient.subscription.findUnique({
                            where: { id: client.subscriptionId },
                        });
                        if (subscription) {
                            revenue += subscription.price;
                        }
                    }
                }
            }
            return revenue;
        });
    }
    calculateInadimplentes(activeClients, month, year) {
        return __awaiter(this, void 0, void 0, function* () {
            let inadimplentes = 0;
            for (const client of activeClients) {
                const lastPaymentDate = client.subscriptionLastPayment;
                const paymentStatus = client.paymentStatus;
                if (!lastPaymentDate ||
                    ((new Date(lastPaymentDate).getMonth() + 1 !== month ||
                        new Date(lastPaymentDate).getFullYear() !== year) &&
                        (paymentStatus === "PENDING" || paymentStatus === "UNPAID"))) {
                    inadimplentes++;
                }
            }
            return inadimplentes;
        });
    }
}
exports.GetGymMetricsUseCase = GetGymMetricsUseCase;
