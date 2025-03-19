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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGymClientUseCase = void 0;
const uuid_1 = require("uuid");
const InvalidFormatUUID_1 = require("../../errors/InvalidFormatUUID");
const prismaClient_1 = require("../../libs/prismaClient");
const UserNotFound_1 = require("../../errors/UserNotFound");
const SubscriptionNotFound_1 = require("../../errors/SubscriptionNotFound");
const AccountAlreadExists_1 = require("../../errors/AccountAlreadExists");
const axios_1 = __importDefault(require("axios"));
class CreateGymClientUseCase {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, email, phone, userId, subscriptionId, taxId, }) {
            var _b;
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
            const gymClientAlreadyExists = yield prismaClient_1.prismaClient.gymClient.findUnique({
                where: {
                    email,
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
            if (gymClientAlreadyExists) {
                throw new AccountAlreadExists_1.AccountAlreadyExists();
            }
            // formata o taxId para 123.456.789-01
            const formattedTaxId = taxId.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
            // cria o client no abacate pay
            const response = yield axios_1.default.post("https://api.abacatepay.com/v1/customer/create", {
                name: name,
                email: email,
                cellphone: phone,
                taxId: formattedTaxId,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.ABACATEPAY_API_KEY}`,
                },
            });
            if (response.status !== 200) {
                throw new Error("Error creating client on Abacate Pay");
            }
            const gymClient = yield prismaClient_1.prismaClient.gymClient.create({
                data: {
                    name,
                    email,
                    phone,
                    ownerId: userId,
                    status: "ACTIVE",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    subscriptionId,
                    paymentStatus: "UNPAID",
                    taxId,
                    abacatePayCustomerId: response.data.data.id,
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
                taxId: gymClient.taxId,
                abacatePayCustomerId: (_b = gymClient.abacatePayCustomerId) !== null && _b !== void 0 ? _b : undefined,
            };
        });
    }
}
exports.CreateGymClientUseCase = CreateGymClientUseCase;
