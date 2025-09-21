import { pool } from "../db/db";

export async function getEmails(tags: string[], limit: number, offset: number) {
  if (tags.length > 0) {
    const result = await pool.query(
      "SELECT * FROM emails WHERE tags && $1::varchar[] ORDER BY id LIMIT $2 OFFSET $3",
      [tags, limit, offset]
    );
    return result.rows;
  } else {
    const result = await pool.query("SELECT * FROM emails ORDER BY id LIMIT $1 OFFSET $2", [
      limit,
      offset,
    ]);
    return result.rows;
  }
}

export async function getEmailById(id: string) {
  const result = await pool.query("SELECT * FROM emails WHERE id=$1", [id]);
  return result.rows[0];
}

export async function getEmailByEmail(email: string, limit: number, offset: number) {
  const result = await pool.query(
    "SELECT * FROM emails WHERE email ILIKE $1 ORDER BY id LIMIT $2 OFFSET $3",
    [`${email}%`, limit, offset]
  );
  return result.rows;
}

export async function createEmail(email: string, note: string, tags: string[]) {
  const result = await pool.query(
    "INSERT INTO emails (email, note, tags) VALUES ($1, $2, $3) RETURNING *",
    [email, note, tags]
  );
  return result.rows[0];
}

export async function updateEmail(id: string, email: string, note: string, tags: string[]) {
  const result = await pool.query(
    "UPDATE emails SET email=$1, note=$2, tags=$3 WHERE id=$4 RETURNING *",
    [email, note, tags, id]
  );
  return result.rows[0];
}

export async function deleteEmail(id: string) {
  const result = await pool.query("DELETE FROM emails WHERE id=$1 RETURNING *", [id]);
  return result.rows[0];
}
