export class SubscriptionHasClients extends Error {
  constructor() {
    super("Subscription has clients");
    this.name = "SubscriptionHasClients";
  }
}
