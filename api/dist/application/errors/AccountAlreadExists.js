"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountAlreadyExists = void 0;
class AccountAlreadyExists extends Error {
    constructor() {
        super("Account already exists");
        this.name = "AccountAlreadyExists";
    }
}
exports.AccountAlreadyExists = AccountAlreadyExists;
