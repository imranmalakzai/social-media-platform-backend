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
