import { pool } from "../config/db.config.js";

// create (Follow a user)
export const create = async (follower_id, following_id) => {
  const [result] = await pool.query(
    "INSERT INTO follows (follower_id,following_id) VALUES (?,?)",
    [follower_id, following_id],
  );
  return result.insertId;
};

// Delete (unfollow a user)
export const remove = async (follower_id, following_id) => {
  const [result] = await pool.query(
    "DELETE FROM follows WHERE follower_id = ?, and following_id = ?",
    [follower_id, following_id],
  );
  return result.affectedRows;
};

// Fetch all followers of a user
export const findAllFollowers = async (userId) => {
  const [rows] = await pool.query(
    "SELECT f.* FROM follows f JOIN users u ON u.id = f.follower_id WHERE f.following_id = ?",
    [userId],
  );
  return rows;
};

// Fetch all users following
export const findAllFollowing = async (userId) => {
  const [rows] = await pool.query(
    "SELECT f.* FROM follows f JOIN users u ON u.id = f.following_id WHERE f.follower_id = ?",
    [userId],
  );
  return rows;
};

// Get a followed user
export const findFollowedUser = async (follower_id, following_id) => {
  const [rows] = await pool.query(
    "SELECT id from follows WHERE follower_id = ? AND following_id = ?",
    [follower_id, following_id],
  );
  return rows[0];
};

// Get followers batch
export const getFollowersBatch = async (userId, limit, offset) => {
  const [rows] = await pool.query(
    "SELECT follower_id FROM followers WHERE following_id = ? LIMIT = ? OFFSET = ?",
    [userId, limit, offset],
  );
  return rows;
};
