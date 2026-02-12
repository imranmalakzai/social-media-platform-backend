import { pool } from "../config/db.config.js";

//create comment
export const create = async (comment) => {
  const [result] = await pool.query(
    "INSERT INTO comments (user_id,post_id,parent_comment_id,text) VALUES (?,?,?,?)",
    [comment.user_id, comment.post_id, comment.parent_comment_id, comment.text],
  );
  return result.insertId;
};
