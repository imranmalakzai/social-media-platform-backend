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
  const [rows] = await pool.query(
    "SELECT p.*,u.profile_image,u.username as author FROM posts p JOIN users u ON p.user_id = u.id  WHERE p.visibility = 'public' AND p.id = ?",
    [postId],
  );
  return rows[0];
};

// Get all posts where visibility is public
export const findAll = async () => {
  const [rows] = await pool.query(
    "SELECT p.*,u.profile_image,u.username as author FROM posts p JOIN users u ON p.user_id = u.id AND p.visibility = 'public'",
  );
  return rows;
};

// Gell all posts of a user
export const findUserPosts = async (userId) => {
  const [rows] = await pool.query(
    "SELECT p.*,u.profile_image,u.username as author FROM posts p JOIN users u ON p.user_id = u.id WHERE p.visibility = 'public' AND p.user_id = ?",
    [userId],
  );
  return rows;
};

// Find my posts
export const findMyPosts = async (userId) => {
  const [rows] = await pool.query(
    "SELECT p.*,u.profile_image,u.username as author FROM posts p JOIN users u ON p.user_id = u.id  AND p.user_id = ?",
    [userId],
  );
  return rows;
};

// Get one of my post by id
export const findMypostById = async (userId, postId) => {
  const [rows] = await pool.query(
    "SELECT p.*,u.profile_image,u.username as author FROM posts p JOIN users u ON p.user_id = u.id  WHERE p.user_id = ? AND p.id = ?",
    [userId, postId],
  );
  return rows[0];
};

// Get a public post by id
export const findUserPostById = async (postId) => {
  const [rows] = await pool.query(
    "SELECT p.*,u.profile_image,u.username as author FROM posts p JOIN users u ON p.user_id = u.id  WHERE p.visibility = 'public'",
    [postId],
  );
  return rows[0];
};
