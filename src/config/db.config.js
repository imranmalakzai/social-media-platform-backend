import { createPool } from "mysql2/promise";
import * as env from "./env.config.js";

export const pool = createPool({
  host: env.HOST,
  database: env.DB_NAME,
  password: env.PASSWORD,
  waitForConnections: true,
  user: env.USER,
  connectionLimit: 10, // max simultaneous connections
  queueLimit: 0,
});
