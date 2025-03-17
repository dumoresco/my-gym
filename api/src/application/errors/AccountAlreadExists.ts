export class AccountAlreadyExists extends Error {
  constructor() {
    super("Account already exists");
    this.name = "AccountAlreadyExists";
  }
}
