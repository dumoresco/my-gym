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
exports.SignUpUseCase = void 0;
const prismaClient_1 = require("../../libs/prismaClient");
const AccountAlreadExists_1 = require("../../errors/AccountAlreadExists");
const bcryptjs_1 = require("bcryptjs");
class SignUpUseCase {
    constructor(salt) {
        this.salt = salt;
    }
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, name, password, }) {
            const userAlreadyExists = yield prismaClient_1.prismaClient.user.findUnique({
                where: {
                    email,
                },
            });
            if (userAlreadyExists) {
                throw new AccountAlreadExists_1.AccountAlreadyExists();
            }
            const hashedPassword = yield (0, bcryptjs_1.hash)(password, this.salt);
            yield prismaClient_1.prismaClient.user.create({
                data: {
                    email,
                    name,
                    password: hashedPassword,
                },
            });
        });
    }
}
exports.SignUpUseCase = SignUpUseCase;
