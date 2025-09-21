import express from "express";
import { getTagsController } from "../controllers/tagController";

const tagRoutes = express.Router();

tagRoutes.get("/tags", getTagsController);

export default tagRoutes;
