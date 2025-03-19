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
exports.CreateBillingController = void 0;
const zod_1 = require("zod");
const AccountAlreadExists_1 = require("../errors/AccountAlreadExists");
const InvalidFormatUUID_1 = require("../errors/InvalidFormatUUID");
const SubscriptionNotFound_1 = require("../errors/SubscriptionNotFound");
class CreateBillingController {
    constructor(createBillingUseCase) {
        this.createBillingUseCase = createBillingUseCase;
    }
    handle(_a) {
        return __awaiter(this, arguments, void 0, function* ({ body }) {
            try {
                const { completionUrl, customerId, products, returnUrl } = body;
                if (!customerId || !products || !returnUrl || !completionUrl) {
                    return {
                        statusCode: 400,
                        body: {
                            message: "Missing required fields",
                        },
                    };
                }
                const { url } = yield this.createBillingUseCase.execute({
                    completionUrl,
                    customerId,
                    products,
                    returnUrl,
                });
                console.log("URL", url);
                return {
                    statusCode: 200,
                    body: {
                        url,
                    },
                };
            }
            catch (err) {
                if (err instanceof zod_1.z.ZodError) {
                    return {
                        statusCode: 400,
                        body: {
                            message: err.issues,
                        },
                    };
                }
                if (err instanceof AccountAlreadExists_1.AccountAlreadyExists) {
                    return {
                        statusCode: 400,
                        body: {
                            message: "Gym client already exists",
                        },
                    };
                }
                if (err instanceof InvalidFormatUUID_1.InvalidFormatUUID) {
                    return {
                        statusCode: 400,
                        body: {
                            message: "Invalid userId format. It must be a valid UUID.",
                        },
                    };
                }
                if (err instanceof SubscriptionNotFound_1.SubscriptionNotFound) {
                    return {
                        statusCode: 404,
                        body: {
                            message: "Subscription not found",
                        },
                    };
                }
                throw err;
            }
        });
    }
}
exports.CreateBillingController = CreateBillingController;
