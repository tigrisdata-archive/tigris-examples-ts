import express, { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import { BaseError } from "./errors";

const middlewares: express.ErrorRequestHandler = (
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
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
