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
exports.GetSubscriptionsController = void 0;
const zod_1 = require("zod");
const InvalidFormatUUID_1 = require("../errors/InvalidFormatUUID");
class GetSubscriptionsController {
    constructor(getSubscriptionsUseCase) {
        this.getSubscriptionsUseCase = getSubscriptionsUseCase;
    }
    handle(_a) {
        return __awaiter(this, arguments, void 0, function* ({ body, params }) {
            try {
                const { userId } = params;
                const subscriptions = yield this.getSubscriptionsUseCase.execute({
                    userId,
                });
                return {
                    statusCode: 200,
                    body: {
                        subscriptions,
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
                if (err instanceof InvalidFormatUUID_1.InvalidFormatUUID) {
                    return {
                        statusCode: 400,
                        body: {
                            message: "Invalid userId format. It must be a valid UUID.",
                        },
                    };
                }
                throw err;
            }
        });
    }
}
exports.GetSubscriptionsController = GetSubscriptionsController;
