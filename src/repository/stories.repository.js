import { pool } from "../config/db.config.js";

// create new story
export const create = async (story) => {
  const [rows] = await pool.query(
    `INSERT INTO stories (user_id, image, expires_at)
     VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR))`,
    [story.user_id, story.image],
  );

  return rows;
};

// Delete story
export const remove = async (id) => {
  const [result] = await pool.query("DELETE FROM stories WHERE id = ?", id);
  return result.affectedRows;
};
