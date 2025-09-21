import dotenv from "dotenv";

dotenv.config();

type configType = {
  port: number;
  nodeEnv: string;
  dbUser: string | undefined;
  dbPassword: string | undefined;
  dbName: string | undefined;
  dbHost: string | undefined;
  dbPort: number | undefined;
};

const config: configType = {
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV || "development",
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  dbHost: process.env.DB_HOST,
  dbPort: Number(process.env.DB_PORT),
};

export default config;
