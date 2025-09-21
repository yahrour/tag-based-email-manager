import { Response } from "express";

export function successResponse(res: Response, data: any = {}, message = "OK", status = 200) {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
}

export function errorResponse(res: Response, message = "Error", status = 500, details: any = null) {
  return res.status(status).json({
    success: false,
    message,
    details,
  });
}
