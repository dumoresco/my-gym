"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAuthenticationMiddleware = makeAuthenticationMiddleware;
const AuthenticationMiddleware_1 = require("../application/middlewares/AuthenticationMiddleware");
function makeAuthenticationMiddleware() {
    return new AuthenticationMiddleware_1.AuthenticationMiddleware();
}
