import express from "express";
import {
  createEmailController,
  deleteEmailController,
  getEmailController,
  getEmailsController,
  searchEmailController,
  updateEmailController,
} from "../controllers/emailController";
import { createEmailSchema, updateEmailSchema, validate } from "../middlewares/emailValidation";
import { validateIdParam } from "../middlewares/paramsValidation";

const emailRoutes = express.Router();

// Get all emails
emailRoutes.get("/emails", getEmailsController);

// Get an email
emailRoutes.get("/emails/:id", validateIdParam(), getEmailController);

// Search for an email
emailRoutes.get("/emails/search/:email", searchEmailController);

// Create an email
emailRoutes.post("/emails", validate(createEmailSchema), createEmailController);

// Update an email
emailRoutes.put(
  "/emails/:id",
  validateIdParam(),
  validate(updateEmailSchema),
  updateEmailController
);

// Delete an email
emailRoutes.delete("/emails/:id", validateIdParam(), deleteEmailController);

export default emailRoutes;
