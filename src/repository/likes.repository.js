import { pool } from "../config/db.config.js";

// create (Like a post)
export const create = async (user_id, post_id) => {
  const [result] = await pool.query(
    "INSERT INTO likes (user_id,post_id) VALUES (?,?)",
    [user_id, post_id],
  );
  return result.insertId;
};

// Delete (unlike a post)
export const remove = async (user_id, post_id) => {
  const [result] = await pool.query(
    "DELETE FROM likes WHERE (user_id,post_id) VALUES (?,?)",
    [user_id, post_id],
  );
  return result.affectedRows;
};

// Get a liked post
export const findById = async (user_id, post_id) => {
  const [rows] = await pool.query(
    "SELECT id FROM likes WHERE user_id = ? AND post_id = ?",
    [user_id, post_id],
  );
  return rows[0];
};
