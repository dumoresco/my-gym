import { z } from "zod";

import { IController, IRequest, IResponse } from "../interfaces/IController";
import { SignUpUseCase } from "../useCases/auth/SignUpUseCase";
import { AccountAlreadyExists } from "../errors/AccountAlreadExists";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export class SignUpController implements IController {
  constructor(private readonly signUpUseCase: SignUpUseCase) {}

  async handle({ body }: IRequest): Promise<IResponse> {
    try {
      const { email, name, password } = schema.parse(body);

      await this.signUpUseCase.execute({
        email,
        name,
        password,
      });

      return {
        statusCode: 201,
        body: {
          name: name,
          email: email,
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

      if (err instanceof AccountAlreadyExists) {
        return {
          statusCode: 409,
          body: {
            message: "Account already exists",
          },
        };
      }

      throw err;
    }
  }
}
