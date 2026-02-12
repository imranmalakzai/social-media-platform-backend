import { pool } from "../config/db.config.js";

// create new user
export const create = async (user) => {
  const [result] = await pool.query(
    "INSERT INTO users (username,email,password,bio,profileImage,coverImage) VALUES (?,?,?,?,?,?)",
    [user.username, user.email, user.bio, user.profileImage, user.coverImage],
  );
  return result.insertId;
};

// delete user
export const remove = async (userId) => {
  const [result] = await pool.query("DELETE FROM users WHERE id = ?", [userId]);
  return result.affectedRows;
};
