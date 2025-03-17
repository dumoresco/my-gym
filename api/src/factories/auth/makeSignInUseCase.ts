import { SignInUseCase } from "../../application/useCases/auth/SignInUseCase";

export function makeSignInUseCase() {
  return new SignInUseCase();
}
