import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import * as env from "../config/env.config.js";

export const auth = async () => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      throw new ApiError("please authenticate", 401);
    }

    const token = header.split(" ")[1];
    const decode = jwt.decode(token, env.JWT_ACCESS_TOKEN_SECRET);

    if (!decode || !token) {
      throw new ApiError("Invalid token or token is expired", 401);
    }

    const user = decode;
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError("Invalid token or token is expired", 401);
  }
};
