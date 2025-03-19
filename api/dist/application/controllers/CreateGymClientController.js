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
exports.CreateGymClientController = void 0;
const zod_1 = require("zod");
const AccountAlreadExists_1 = require("../errors/AccountAlreadExists");
const InvalidFormatUUID_1 = require("../errors/InvalidFormatUUID");
const SubscriptionNotFound_1 = require("../errors/SubscriptionNotFound");
const schema = zod_1.z.object({
    email: zod_1.z.string().email(),
    phone: zod_1.z.string(),
    name: zod_1.z.string(),
    subscriptionId: zod_1.z.string().uuid(),
    taxId: zod_1.z.string(),
});
class CreateGymClientController {
    constructor(createGymClientUseCase) {
        this.createGymClientUseCase = createGymClientUseCase;
    }
    handle(_a) {
        return __awaiter(this, arguments, void 0, function* ({ body, params }) {
            try {
                const { userId } = params;
                const { email: client_email, name: client_name, phone: client_phone, subscriptionId, taxId, } = schema.parse(body);
                const { id, createdAt, email, name, phone, status, updatedAt, abacatePayCustomerId, } = yield this.createGymClientUseCase.execute({
                    email: client_email,
                    name: client_name,
                    phone: client_phone,
                    userId,
                    subscriptionId,
                    taxId,
                });
                return {
                    statusCode: 200,
                    body: {
                        id,
                        name,
                        email,
                        phone,
                        status,
                        createdAt,
                        updatedAt,
                        taxId,
                        abacatePayCustomerId,
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
exports.CreateGymClientController = CreateGymClientController;
