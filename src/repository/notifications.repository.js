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
