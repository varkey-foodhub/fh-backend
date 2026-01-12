import { ZodObject, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../errors";

type ZodSchemas = {
  body?: ZodObject;
  params?: ZodObject;
  query?: ZodObject;
};

export const validate =
  (schemas: ZodSchemas) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }

      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }

      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        throw new ValidationError(err.message)
      }
      next(err);
    }
  };
