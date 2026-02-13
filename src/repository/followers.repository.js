import { pool } from "../config/db.config.js";

// create (Follow a user)
export const create = async (follower_id, following_id) => {
  const [result] = await pool.query(
    "INSERT INTO follows (follower_id,following_id) VALUES (?,?)",
    [follower_id, following_id],
  );
  return result.insertId;
};
