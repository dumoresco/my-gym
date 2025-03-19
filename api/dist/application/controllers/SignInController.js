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
exports.SignInController = void 0;
const zod_1 = require("zod");
const InvalidCredentials_1 = require("../errors/InvalidCredentials");
const schema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
class SignInController {
    constructor(signInUseCase) {
        this.signInUseCase = signInUseCase;
    }
    handle(_a) {
        return __awaiter(this, arguments, void 0, function* ({ body }) {
            try {
                const { email, password } = schema.parse(body);
                const { accessToken, id, name, email: userEmail, } = yield this.signInUseCase.execute({
                    email,
                    password,
                });
                return {
                    statusCode: 200,
                    body: {
                        id,
                        name,
                        email: userEmail,
                        accessToken: accessToken,
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
                if (err instanceof InvalidCredentials_1.InvalidCredentials) {
                    return {
                        statusCode: 401,
                        body: {
                            message: "Invalid credentials",
                        },
                    };
                }
                throw err;
            }
        });
    }
}
exports.SignInController = SignInController;
