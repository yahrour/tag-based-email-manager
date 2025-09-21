import { NextFunction, Request, Response } from "express";
import * as z from "zod";
import {
  createEmail,
  deleteEmail,
  getEmailByEmail,
  getEmailById,
  getEmails,
  updateEmail,
} from "../models/emailModel";
import { successResponse } from "../utils/response";

const numberSchema = z.object({
  limit: z.number().min(0),
  offset: z.number().min(0),
});

export async function getEmailsController(req: Request, res: Response, next: NextFunction) {
  try {
    const tagsQuery = req.query.tags;
    const limit = Number(req.query.limit);
    const offset = Number(req.query.offset);

    const checkQueries = numberSchema.safeParse({ limit, offset });
    if (!checkQueries.success) {
      console.log("bad request: limit/offset query");
      throw new Error("Bad request");
    }

    let tags: string[] = [];
    if (typeof tagsQuery === "string") {
      tags = tagsQuery.split(",");
    }
    if (tags.length > 0 && tags[0].length === 0) {
      tags = [];
    }
    const result = await getEmails(tags, limit, offset);
    return successResponse(res, result, "Emails fetched");
  } catch (err) {
    next(err);
  }
}

export async function getEmailController(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const result = await getEmailById(id);
    return successResponse(res, result, "Email fetched");
  } catch (err) {
    next(err);
  }
}

export async function searchEmailController(req: Request, res: Response, next: NextFunction) {
  try {
    const limit = Number(req.query.limit);
    const offset = Number(req.query.offset);

    const checkQueries = numberSchema.safeParse({ limit, offset });
    if (!checkQueries.success) {
      console.log("bad request: limit/offset query");
      throw new Error("Bad request");
    }

    const email = req.params.email;
    const result = await getEmailByEmail(email, limit, offset);
    return successResponse(res, result, "Email fetched");
  } catch (err) {
    next(err);
  }
}

export async function createEmailController(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, note, tags } = req.body;
    const result = await createEmail(email, note, tags);
    return successResponse(res, result, "Email created", 201);
  } catch (err) {
    next(err);
  }
}

export async function updateEmailController(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const { email, note, tags } = req.body;
    const result = await updateEmail(id, email, note, tags);
    return successResponse(res, result, "Email updated", 200);
  } catch (err) {
    next(err);
  }
}

export async function deleteEmailController(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const result = await deleteEmail(id);
    return successResponse(res, result, "Email deleted", 200);
  } catch (err) {
    next(err);
  }
}
