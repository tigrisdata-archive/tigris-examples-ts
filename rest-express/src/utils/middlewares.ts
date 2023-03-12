import { BaseError } from "./errors";
import { NextFunction, Request, Response, ErrorRequestHandler } from "express";
import { AnyZodObject } from "zod";

const middlewares: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!(err instanceof BaseError)) {
    next(err);
  }

  return res.status(err.httpCode).json({
    error: err.description,
    isOperational: err.isOperational,
    additional: err.additional,
  });
};

const validateInput =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await schema.safeParseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (result.success === false) {
      return res.status(400).json(result.error.format());
    }

    return next();
  };

export default {
  validateInput: validateInput,
  handleErrors: middlewares,
};
