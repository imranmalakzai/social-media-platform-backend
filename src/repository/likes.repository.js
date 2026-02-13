import { pool } from "../config/db.config.js";

// create (Like a post)
export const create = async (user_id, post_id) => {
  const [result] = await pool.query(
    "INSERT INTO likes (user_id,post_id) VALUES (?,?)",
    [user_id, post_id],
  );
  return result.insertId;
};
