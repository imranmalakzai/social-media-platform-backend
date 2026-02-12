import env from "dotenv";
env.configDotenv({ path: ".env" });
export const {
  PORT,
  DB_NAME,
  USER,
  HOST,
  PASSWORD,
  CORS_ORIGIN,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_EXPIRY,
  JWT_REFRESH_TOKEN_EXPIRY,
} = process.env;
