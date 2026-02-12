import { pool } from "../config/db.config.js";

//create comment
export const create = async (comment) => {
  const [result] = await pool.query(
    "INSERT INTO comments (user_id,post_id,parent_comment_id,text) VALUES (?,?,?,?)",
    [comment.user_id, comment.post_id, comment.parent_comment_id, comment.text],
  );
  return result.insertId;
};

// Delete a comment
export const remove = async (commentId) => {
  const [result] = await pool.query("DELETE FROM comments WHERE id = ?", [
    commentId,
  ]);
  return result.affectedRows;
};

// update a comment
export const update = async (text, commentId) => {
  const [result] = await pool.query(
    "UPDATE comments SET text = ? WHERE id = ?",
    [text, commentId],
  );
  return result.affectedRows;
};
