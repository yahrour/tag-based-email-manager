import { NextFunction, Request, Response } from "express";
import { getTags } from "../models/tagModel";
import { successResponse } from "../utils/response";

export async function getTagsController(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await getTags();
    return successResponse(res, result, "Tags fetched");
  } catch (err) {
    next(err);
  }
}
