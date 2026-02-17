import { pool } from "../config/db.config.js";
import { refreshToken } from "../utils/jwt.js";

// create new user
export const create = async (user) => {
  const [result] = await pool.query(
    "INSERT INTO users (username,email,password) VALUES (?,?,?)",
    [user.username, user.email, user.password],
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
  const [rows] = await pool.query("SELECT id users WHERE id = ?", [userId]);
  return rows[0];
};

// Get a user by Email
export const findByEmail = async (email) => {
  const [rows] = await pool.query(
    "SELECT id,password,username FROM users WHERE email = ?",
    [email],
  );
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

// update avatar (profile image)
export const updateAvatar = async (avatar, userId) => {
  const [result] = await pool.query(
    "UPDATE users SET profile_image = ? WHERE id = ?",
    [avatar, userId],
  );
  return result.affectedRows;
};

// update cover image
export const updateCoverImage = async (coverImage, userId) => {
  const [result] = await pool.query(
    "UPDATE users SET cover_image = ? WHERE id = ?",
    [coverImage, userId],
  );
  return result.affectedRows;
};

// Get a user by token
export const findByToken = async (token) => {
  const [rows] = await pool.query(
    "SELECT id FROM users WHERE refresh_token = ?",
    [token],
  );
  return rows[0];
};

// Mark user verified
export const verifyUser = async (userId) => {
  const [result] = await pool.query(
    "UPDATE users SET is_verified = '1' WHERE id = ?",
    [userId],
  );
  return result.affectedRows;
};

// update user delete token
export const updateToken = async (token) => {
  const [result] = await pool.query(
    "UPDATE users SET refresh_token = null WHERE refresh_token = ?",
    [token],
  );
  return result.affectedRows;
};
