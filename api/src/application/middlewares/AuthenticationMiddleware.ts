import { verify, JwtPayload } from "jsonwebtoken";
import {
  IData,
  IMiddleware,
  IRequest,
  IResponse,
} from "../interfaces/IMiddleware";

export class AuthenticationMiddleware implements IMiddleware {
  async handle({ headers, params }: IRequest): Promise<IResponse | IData> {
    const { authorization } = headers;

    if (!authorization) {
      return {
        body: {
          error: "Unauthorized",
        },
        statusCode: 401,
      };
    }

    try {
      const [bearer, token] = authorization.split(" ");

      if (bearer !== "Bearer") {
        throw new Error("Unauthorized");
      }

      const payload = verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;

      if (params?.userId && params.userId !== payload.sub) {
        return {
          body: {
            error: "Forbidden: You cannot access this resource.",
          },
          statusCode: 403,
        };
      }

      return {
        data: {
          userId: payload.sub,
        },
      };
    } catch (error) {
      return {
        body: {
          error: "Unauthorized",
        },
        statusCode: 401,
      };
    }
  }
}
