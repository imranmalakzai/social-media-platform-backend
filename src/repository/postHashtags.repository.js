import { pool } from "../config/db.config.js";

export const create = async (post_id, hashtag_id) => {
  const [result] = await pool.query(
    "INSERT INTO post_hashtags (post_id,hashtag_id) VALUES (?,?)",
    [post_id, hashtag_id],
  );
  return result.insertId;
};

// Get all hashTags of a post
export const findAll = async () => {
  const [rows] = await pool.query(
    "SELECT *.pt,ht.name FROM post_hashtags pt JOIN ht ON pt.hashtag_id = ht.id",
  );
  return rows;
};
