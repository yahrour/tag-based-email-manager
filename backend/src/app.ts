import cors from "cors";
import express from "express";
import { createEmailsTable, testDbConnection } from "./db/db";
import { errorHandler } from "./middlewares/errorHandler";
import emailRoutes from "./routes/emailRoute";
import tagRoutes from "./routes/tagRoute";

const app = express();

// Test db connection
(async () => {
  await testDbConnection();
  await createEmailsTable();
})();

app.use(express.json());
app.use(cors());

app.use("/api", emailRoutes);
app.use("/api", tagRoutes);

app.use(errorHandler);

export default app;
