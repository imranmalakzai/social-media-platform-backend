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

// Get All users liked a post
export const findAllUsers = async (postId) => {
  const [rows] = await pool.query(
    "SELECT l.*,u.username,u.profile_image FROM likes l JOIN users u ON u.id = l.user_id WHERE l.post_id = ?",
    [postId],
  );
  return rows;
};
