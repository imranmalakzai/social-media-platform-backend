import { asyncHandler } from "../utils/asyncHandler.js";
import * as userDb from "../repository/users.repository.js";
import ApiError from "../utils/ApiError.js";
import * as generate from "../utils/jwt.js";

// Register a user
export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // prevent dublicate email
  const user = await userDb.findByEmail(email);
  if (user) throw new ApiError("Email is already in used", 400);

  const result = await userDb.create({ username, email, password });
  if (result === 0) throw new ApiError("Internal server error", 500);

  res.status(201).json({ message: "Registration successed" });
});
