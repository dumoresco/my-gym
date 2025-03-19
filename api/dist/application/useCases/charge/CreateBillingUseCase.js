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
exports.CreateBillingUseCase = void 0;
const prismaClient_1 = require("../../libs/prismaClient");
const SubscriptionNotFound_1 = require("../../errors/SubscriptionNotFound");
const axios_1 = __importDefault(require("axios"));
class CreateBillingUseCase {
    constructor() { }
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ completionUrl, customerId, products, returnUrl, }) {
            // https://api.abacatepay.com/v1/billing/create
            const subscriptionExists = yield prismaClient_1.prismaClient.subscription.findUnique({
                where: {
                    id: products[0].externalId,
                },
            });
            if (!subscriptionExists) {
                throw new SubscriptionNotFound_1.SubscriptionNotFound();
            }
            // https://api.abacatepay.com/v1/billing/create
            const response = yield axios_1.default.post("https://api.abacatepay.com/v1/billing/create", {
                frequency: "ONE_TIME",
                methods: ["PIX"],
                products: products.map((product) => ({
                    externalId: product.externalId,
                    name: product.name,
                    description: product.description,
                    quantity: product.quantity,
                    price: product.price,
                })),
                returnUrl,
                completionUrl,
                customerId,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.ABACATEPAY_API_KEY}`,
                },
            });
            return {
                url: response.data.data.url,
            };
        });
    }
}
exports.CreateBillingUseCase = CreateBillingUseCase;
