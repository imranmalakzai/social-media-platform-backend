import { pool } from "../config/db.config.js";

export const create = async (post_id, hashtag_id) => {
  const [result] = await pool.query(
    "INSERT INTO post_hashtags (post_id,hashtag_id) VALUES (?,?)",
    [post_id, hashtag_id],
  );
  return result.insertId;
};
