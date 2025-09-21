import { Request, Response } from "express";
import { errorResponse } from "../utils/response";

export function errorHandler(req: Request, res: Response) {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] [Error] ${req.method} ${req.originalUrl}`);
  return errorResponse(res, "Internal Server Error", 500);
}
