import { pool } from "../config/db.config.js";

// create a new post
export const create = async (post) => {
  const [result] = await pool.query(
    "INSERT INTO posts (user_id,caption,image,visibility) VALUES (?,?,?,?)",
    [post.user_id, post.caption, post.image, post.visibility],
  );
  return result.insertId;
};

// Delete a post
export const remove = async (postId) => {
  const [result] = await pool.query("DELETE FROM posts WHERE id = ? ", [
    postId,
  ]);
  return result.affectedRows;
};
