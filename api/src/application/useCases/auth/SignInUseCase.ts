import { PrismaClient } from "@prisma/client";
import { prismaClient } from "../../libs/prismaClient";
import { AccountAlreadyExists } from "../../errors/AccountAlreadExists";
import { compare, hash } from "bcryptjs";
import { InvalidCredentials } from "../../errors/InvalidCredentials";
import { sign } from "jsonwebtoken";
interface IInputSignInUseCase {
  email: string;
  password: string;
}

interface IOutputSignInUseCase {
  id: string;
  accessToken: string;
  name: string;
  email: string;
}

export class SignInUseCase {
  async execute({
    email,
    password,
  }: IInputSignInUseCase): Promise<IOutputSignInUseCase> {
    const user = await prismaClient.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new InvalidCredentials();
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new InvalidCredentials();
    }

    const accessToken = sign(
      {
        sub: user.id,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      }
    );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      accessToken: accessToken,
    };
  }
}
