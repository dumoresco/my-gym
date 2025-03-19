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
exports.SignUpController = void 0;
const zod_1 = require("zod");
const AccountAlreadExists_1 = require("../errors/AccountAlreadExists");
const schema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
class SignUpController {
    constructor(signUpUseCase) {
        this.signUpUseCase = signUpUseCase;
    }
    handle(_a) {
        return __awaiter(this, arguments, void 0, function* ({ body }) {
            try {
                const { email, name, password } = schema.parse(body);
                yield this.signUpUseCase.execute({
                    email,
                    name,
                    password,
                });
                return {
                    statusCode: 201,
                    body: {
                        name: name,
                        email: email,
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
                        statusCode: 409,
                        body: {
                            message: "Account already exists",
                        },
                    };
                }
                throw err;
            }
        });
    }
}
exports.SignUpController = SignUpController;
