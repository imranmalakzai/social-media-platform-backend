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

// Get a user by id
export const findById = async (userId) => {
  const [rows] = await pool.query("SELECT * users WHERE id = ?", [userId]);
  return rows[0];
};

// Get a user by Email
export const findByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0];
};

// Get all users
export const find = async () => {
  const [rows] = await pool.query("SELECT * FROM users");
  return rows;
};

// update profile // username,and bio
export const updateProfile = async (username, bio, userId) => {
  const [result] = await pool.query(
    "UPDATE users SET username = ?,bio = ? WHERE id = ?",
    [username, bio, userId],
  );
  return result.affectedRows;
};

// update password
export const updatePassword = async (password, userId) => {
  const [result] = await pool.query(
    "UPDATE USERS SET password = ? WHERE id = ?",
    [password, userId],
  );
  return result;
};
