import { pool } from "../config/db.config.js";

// create save post (add to archive)
export const create = async (archive) => {
  const [result] = await pool.query(
    "INSERT INTO saved_posts (user_id,post_id) VALUES (?,?)",
    [archive.user_id, archive.post_id],
  );
  return result.insertId;
};
