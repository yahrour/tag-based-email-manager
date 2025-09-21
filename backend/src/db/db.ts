import { Pool } from "pg";
import config from "../config/config";

export const pool = new Pool({
  user: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,
  host: config.dbHost,
  port: config.dbPort,
});

pool.on("connect", () => {
  console.log("Database Got Connection");
});

export async function testDbConnection() {
  try {
    await pool.query("SELECT current_database()");
    console.log("Connected to db sucessfully");
  } catch (error) {
    console.error(`Failed to connect to db: ${error}`);
  }
}

export async function createEmailsTable() {
  const query = `CREATE TABLE IF NOT EXISTS emails (
    id SERIAL PRIMARY KEY,
    email VARCHAR(50) UNIQUE NOT NULL,
    note VARCHAR(200),
    tags VARCHAR(15)[] NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`;

  try {
    pool.query(query);
  } catch (err) {
    console.log(`Error creating emails table: ${err}`);
  }
}
