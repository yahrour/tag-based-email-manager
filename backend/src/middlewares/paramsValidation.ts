import { NextFunction, Request, Response } from "express";
import * as z from "zod";
import { errorResponse } from "../utils/response";

const idSchema = z.object({
  id: z.number().positive(),
});

const emailSchema = z.object({
  email: z.email(),
});

export function validateIdParam() {
  return function (req: Request, res: Response, next: NextFunction) {
    const obj = { id: Number(req.params.id) };
    const result = idSchema.safeParse(obj);
    if (!result.success) {
      return errorResponse(res, "Bad Request", 400, "invalid id param");
    }
    next();
  };
}

export function validateEmailParam() {
  return function (req: Request, res: Response, next: NextFunction) {
    const obj = { email: req.params.email };
    const result = emailSchema.safeParse(obj);
    if (!result.success) {
      return errorResponse(res, "Bad Request", 400, "invalid email param");
    }
    next();
  };
}
