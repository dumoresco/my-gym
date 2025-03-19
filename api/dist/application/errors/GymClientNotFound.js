"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GymClientNotFound = void 0;
class GymClientNotFound extends Error {
    constructor() {
        super("Gym client not found");
        this.name = "GymClientNotFound";
    }
}
exports.GymClientNotFound = GymClientNotFound;
