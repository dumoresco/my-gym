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
exports.AuthenticationMiddleware = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
class AuthenticationMiddleware {
    handle(_a) {
        return __awaiter(this, arguments, void 0, function* ({ headers, params }) {
            const { authorization } = headers;
            if (!authorization) {
                return {
                    body: {
                        error: "Unauthorized",
                    },
                    statusCode: 401,
                };
            }
            try {
                const [bearer, token] = authorization.split(" ");
                if (bearer !== "Bearer") {
                    throw new Error("Unauthorized");
                }
                const payload = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
                if ((params === null || params === void 0 ? void 0 : params.userId) && params.userId !== payload.sub) {
                    return {
                        body: {
                            error: "Forbidden: You cannot access this resource.",
                        },
                        statusCode: 403,
                    };
                }
                return {
                    data: {
                        userId: payload.sub,
                    },
                };
            }
            catch (error) {
                return {
                    body: {
                        error: "Unauthorized",
                    },
                    statusCode: 401,
                };
            }
        });
    }
}
exports.AuthenticationMiddleware = AuthenticationMiddleware;
