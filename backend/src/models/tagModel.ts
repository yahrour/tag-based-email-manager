import { pool } from "../db/db";

export async function getTags() {
  const result = await pool.query("SELECT DISTINCT unnest(tags) AS tag FROM emails");
  return result.rows;
}
