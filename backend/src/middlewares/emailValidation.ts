import { NextFunction, Request, Response } from "express";
import * as z from "zod";
import { errorResponse } from "../utils/response";

export const updateEmailSchema = z.object({
  email: z.email(),
  note: z.string().max(200).optional(),
  tags: z.array(z.string().min(1)).nonempty(),
});

export const createEmailSchema = z.object({
  email: z.email(),
  note: z.string().max(200).optional(),
  tags: z.array(z.string().min(1)).nonempty(),
});

export function validate(schema: z.ZodType) {
  return function (req: Request, res: Response, next: NextFunction) {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return errorResponse(res, "Bad Request", 400, "invalid field(s)");
    }
    req.body = result.data;
    next();
  };
}
