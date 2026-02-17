import { pool } from "../config/db.config.js";

// Create OTP
export const create = async (userId, otpHash, type) => {
  //  Remove previous active OTP of same type
  await pool.query(
    `DELETE FROM otps 
     WHERE user_id = ? 
     AND type = ? 
     AND consumed_at IS NULL`,
    [userId, type],
  );

  // Insert new OTP
  const [result] = await pool.query(
    `INSERT INTO otps (user_id, otp_hash, type, expires_at) 
     VALUES (?, ?, ?, ?)`,
    [
      userId,
      otpHash,
      type,
      new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    ],
  );

  return result.insertId;
};
