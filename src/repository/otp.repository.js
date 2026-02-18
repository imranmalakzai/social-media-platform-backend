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
     VALUES (?, ?, ?,DATE_ADD(NOW(), INTERVAL 10 MINUTE))`,
    [userId, otpHash, type],
  );

  return result.insertId;
};

// Find a valid otp
export const findValidOtp = async (userId, type) => {
  const [rows] = await pool.query(
    `SELECT * FROM otps
     WHERE user_id = ? AND type = ? AND consumed_at IS NULL AND expires_at > NOW()`,
    [userId, type],
  );
  return rows[0];
};

export const consumeOtp = async (otpId) => {
  await pool.query(
    `UPDATE otps
     SET consumed_at = NOW()
     WHERE id = ?`,
    [otpId],
  );
};

export const deleteExpiredOtps = async () => {
  await pool.query(
    `DELETE FROM otps 
     WHERE expires_at < NOW()`,
  );
};
