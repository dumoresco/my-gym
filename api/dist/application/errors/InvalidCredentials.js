"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidCredentials = void 0;
class InvalidCredentials extends Error {
    constructor() {
        super("Invalid credentials");
        this.name = "InvalidCredentials";
    }
}
exports.InvalidCredentials = InvalidCredentials;
