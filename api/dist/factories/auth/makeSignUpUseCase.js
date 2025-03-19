"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSignUpUseCase = makeSignUpUseCase;
const SignUpUseCase_1 = require("../../application/useCases/auth/SignUpUseCase");
function makeSignUpUseCase() {
    const SALT = 10;
    return new SignUpUseCase_1.SignUpUseCase(SALT);
}
