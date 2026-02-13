import { pool } from "../config/db.config.js";

// create save post (add to archive)
export const create = async (archive) => {
  const [result] = await pool.query(
    "INSERT INTO saved_posts (user_id,post_id) VALUES (?,?)",
    [archive.user_id, archive.post_id],
  );
  return result.insertId;
};

// Delete a saved post
export const remove = async (postId) => {
  const [result] = await pool.query(
    "DELETE * FROM saved_posts WHERE post_id = ?",
    [postId],
  );
  return result.affectedRows;
};

// Get all saved posts
export const findAll = async (user_id) => {
  const [rows] = await pool.query(
    "SELECT sp.*,u.username,u.profile_image,p.caption,p.image FROM saved_posts sp JOIN users u on u.id = sp.user_id JOIN posts p ON p.id = sp.post_id WHERE sp.user_id = ?",
    [user_id],
  );
  return rows;
};
