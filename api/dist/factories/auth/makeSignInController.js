"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSignInController = makeSignInController;
const SignInController_1 = require("../../application/controllers/SignInController");
const makeSignInUseCase_1 = require("./makeSignInUseCase");
function makeSignInController() {
    const signInUseCase = (0, makeSignInUseCase_1.makeSignInUseCase)();
    return new SignInController_1.SignInController(signInUseCase);
}
