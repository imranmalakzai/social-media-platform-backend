import { pool } from "../config/db.config.js";

// Create otp message
export const create = async (userId, optHash, type) => {
  const [result] = await pool.query(
    "INSERT INTO opts (user_id,opt_hash,type,expires_at) VALUES (?,?,?,?)",
    [userId, optHash, type, new Date(Date.now() + 10 * 60 * 1000)],
  );
  return result.insertId;
};
