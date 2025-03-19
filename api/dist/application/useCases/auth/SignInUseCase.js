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
exports.SignInUseCase = void 0;
const prismaClient_1 = require("../../libs/prismaClient");
const bcryptjs_1 = require("bcryptjs");
const InvalidCredentials_1 = require("../../errors/InvalidCredentials");
const jsonwebtoken_1 = require("jsonwebtoken");
class SignInUseCase {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, password, }) {
            const user = yield prismaClient_1.prismaClient.user.findUnique({
                where: {
                    email,
                },
            });
            if (!user) {
                throw new InvalidCredentials_1.InvalidCredentials();
            }
            const isPasswordValid = yield (0, bcryptjs_1.compare)(password, user.password);
            if (!isPasswordValid) {
                throw new InvalidCredentials_1.InvalidCredentials();
            }
            const accessToken = (0, jsonwebtoken_1.sign)({
                sub: user.id,
            }, process.env.JWT_SECRET, {
                expiresIn: "1d",
            });
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                accessToken: accessToken,
            };
        });
    }
}
exports.SignInUseCase = SignInUseCase;
