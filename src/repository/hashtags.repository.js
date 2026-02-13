import { pool } from "../config/db.config.js";

// create hashTags
export const create = async (name) => {
  const [result] = await pool.query("INSERT INTO hashtags (names) VALUE (?)", [
    name,
  ]);
  return result.affectedRows;
};
