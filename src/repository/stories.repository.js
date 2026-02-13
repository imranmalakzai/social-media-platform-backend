import { pool } from "../config/db.config.js";

// create new story
export const create = async (story) => {
  const [result] = await pool.query(
    `INSERT INTO stories (user_id, image, expires_at)
     VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR))`,
    [story.user_id, story.image],
  );

  return result.insertId;
};

// Delete story
export const remove = async (id) => {
  const [result] = await pool.query("DELETE FROM stories WHERE id = ?", id);
  return result.affectedRows;
};

// Get all active stories
export const findAll = async () => {
  const [rows] = await pool.query(
    "SELECT s.*,u.username,u.profile_image FROM stories s JOIN users u ON s.user_id = u.id",
  );
  return rows;
};
