import { z } from "zod";

import { IController, IRequest, IResponse } from "../interfaces/IController";
import { SignUpUseCase } from "../useCases/auth/SignUpUseCase";
import { SignInUseCase } from "../useCases/auth/SignInUseCase";
import { InvalidCredentials } from "../errors/InvalidCredentials";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export class SignInController implements IController {
  constructor(private readonly signInUseCase: SignInUseCase) {}

  async handle({ body }: IRequest): Promise<IResponse> {
    try {
      const { email, password } = schema.parse(body);

      const {
        accessToken,
        id,
        name,
        email: userEmail,
      } = await this.signInUseCase.execute({
        email,
        password,
      });

      return {
        statusCode: 200,
        body: {
          id,
          name,
          email: userEmail,
          accessToken: accessToken,
        },
      };
    } catch (err) {
      if (err instanceof z.ZodError) {
        return {
          statusCode: 400,
          body: {
            message: err.issues,
          },
        };
      }

      if (err instanceof InvalidCredentials) {
        return {
          statusCode: 401,
          body: {
            message: "Invalid credentials",
          },
        };
      }

      throw err;
    }
  }
}
