"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSignInUseCase = makeSignInUseCase;
const SignInUseCase_1 = require("../../application/useCases/auth/SignInUseCase");
function makeSignInUseCase() {
    return new SignInUseCase_1.SignInUseCase();
}
