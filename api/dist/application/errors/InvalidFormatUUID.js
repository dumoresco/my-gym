"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidFormatUUID = void 0;
class InvalidFormatUUID extends Error {
    constructor() {
        super("Invalid format UUID");
        this.name = "InvalidFormatUUID";
    }
}
exports.InvalidFormatUUID = InvalidFormatUUID;
