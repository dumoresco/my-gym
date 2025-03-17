export class SubscriptionNotFound extends Error {
  constructor() {
    super("Subscription not found");
    this.name = "SubscriptionNotFound";
  }
}
