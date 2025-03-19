"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSignUpController = makeSignUpController;
const SignUpController_1 = require("../../application/controllers/SignUpController");
const makeSignUpUseCase_1 = require("./makeSignUpUseCase");
function makeSignUpController() {
    const signUpUseCase = (0, makeSignUpUseCase_1.makeSignUpUseCase)();
    return new SignUpController_1.SignUpController(signUpUseCase);
}
