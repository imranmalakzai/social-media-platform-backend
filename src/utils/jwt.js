import jwt from "jsonwebtoken";
import * as env from "../config/env.config.js";

// Generate Access Token
export const accessToken = async (user) => {
  const token = await jwt.sign(
    { id: user.id, username: user.username },
    env.JWT_ACCESS_TOKEN_SECRET,
    { expiresIn: env.JWT_ACCESS_TOKEN_EXPIRY },
  );
  return token;
};
