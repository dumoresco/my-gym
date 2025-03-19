"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionHasClients = void 0;
class SubscriptionHasClients extends Error {
    constructor() {
        super("Subscription has clients");
        this.name = "SubscriptionHasClients";
    }
}
exports.SubscriptionHasClients = SubscriptionHasClients;
