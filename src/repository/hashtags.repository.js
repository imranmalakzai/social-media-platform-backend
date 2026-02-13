import { pool } from "../config/db.config.js";

// create hashTags
export const create = async (name) => {
  const [result] = await pool.query("INSERT INTO hashtags (names) VALUE (?)", [
    name,
  ]);
  return result.insertId;
};

// Get hashTag by name
export const findByName = async (name) => {
  const [rows] = await pool.query("SELECT * FROM hashtags WHERE name = ?", [
    name,
  ]);
  return rows[0];
};
