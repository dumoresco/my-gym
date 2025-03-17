export class GymClientNotFound extends Error {
  constructor() {
    super("Gym client not found");
    this.name = "GymClientNotFound";
  }
}
