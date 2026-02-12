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

//update a post (caption,image)
export const updatePost = async (caption, image, postId) => {
  const [result] = await pool.query(
    "UPDATE posts SET image = ?, caption = ? WHERE id = ?",
    [postId],
  );
  return result.affectedRows;
};

// change visibility
export const changeVisibility = async (visibility, postId) => {
  const [result] = await pool.query(
    "UPDATE posts SET visibility = ? WHERE id = ?",
    [visibility, postId],
  );
  return result.affectedRows;
};

// Get a post by id
export const findById = async (postId) => {
  const [rows] = await pool.query("SELECT * FROM post WHERE id = ?", [postId]);
  return rows[0];
};
