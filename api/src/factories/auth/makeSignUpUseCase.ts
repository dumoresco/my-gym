import { SignUpUseCase } from "../../application/useCases/auth/SignUpUseCase";

export function makeSignUpUseCase() {
  const SALT = 10;
  return new SignUpUseCase(SALT);
}
