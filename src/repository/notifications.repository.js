import { pool } from "../config/db.config.js";

// create Notifications
export const create = async (notification) => {
  const [result] = await pool.query(
    "INSERT INTO notifications (recipient_id,sender_id,type,post_id) VALUES (?,?,?,?)",
    [
      notification.recipient_id,
      notification.sender_id,
      notification.type,
      notification.post_id,
    ],
  );
  return result.insertId;
};

// Get all notifications of a user
export const findAll = async (user_id) => {
  const [rows] = await pool.query(
    "SELECT n.*,u.username,u.profile_image FROM notifications n JOIN users u ON u.id = n.sender_id ORDER BY created_at DESC",
    [user_id],
  );
  return rows;
};

// Mark Read a notification
export const markRead = async (notificationId) => {
  const [result] = await pool.query(
    "UPDATE notifications SET is_read = '0' WHERE id = ?",
    [notificationId],
  );
  return result.affectedRows;
};
