export class InvalidFormatUUID extends Error {
  constructor() {
    super("Invalid format UUID");
    this.name = "InvalidFormatUUID";
  }
}
