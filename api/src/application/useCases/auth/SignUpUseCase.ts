import { prismaClient } from "../../libs/prismaClient";
import { AccountAlreadyExists } from "../../errors/AccountAlreadExists";
import { hash } from "bcryptjs";

interface IInputSignUpUseCase {
  name: string;
  email: string;
  password: string;
}

type IOutputSignUpUseCase = void;

export class SignUpUseCase {
  constructor(private readonly salt: number) {}
  async execute({
    email,
    name,
    password,
  }: IInputSignUpUseCase): Promise<IOutputSignUpUseCase> {
    const userAlreadyExists = await prismaClient.user.findUnique({
      where: {
        email,
      },
    });

    if (userAlreadyExists) {
      throw new AccountAlreadyExists();
    }

    const hashedPassword = await hash(password, this.salt);

    await prismaClient.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });
  }
}
