"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionNotFound = void 0;
class SubscriptionNotFound extends Error {
    constructor() {
        super("Subscription not found");
        this.name = "SubscriptionNotFound";
    }
}
exports.SubscriptionNotFound = SubscriptionNotFound;
