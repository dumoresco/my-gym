import { Request, Response } from "express";
import { IController } from "../../application/interfaces/IController";

export function routeAdapter(controller: IController) {
  return async (req: Request, res: Response) => {
    const { body, statusCode } = await controller.handle({
      body: req.body,
      params: req.params,
      query: req.query,
      userId: res?.locals?.user?.userId || undefined,
    });

    res.status(statusCode).json(body);
  };
}
