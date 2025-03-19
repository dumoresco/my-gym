"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserNotFound = void 0;
class UserNotFound extends Error {
    constructor() {
        super("User not found");
        this.name = "UserNotFound";
    }
}
exports.UserNotFound = UserNotFound;
