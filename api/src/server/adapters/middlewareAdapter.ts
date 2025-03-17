import { NextFunction, Request, Response } from "express";
import { IMiddleware } from "../../application/interfaces/IMiddleware";

export function middlewareAdapter(middleware: IMiddleware): any {
  return async (req: Request, res: Response, next: NextFunction) => {
    const result = await middleware.handle({
      headers: req.headers as Record<string, string>,
      params: req.params as Record<string, any>,
    });

    if ("statusCode" in result) {
      const { statusCode, body } = result;
      return res.status(statusCode).send(body);
    }

    res.locals.user = result.data;

    next();
  };
}
