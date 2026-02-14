import { asyncHandler } from "../utils/asyncHandler.js";
import * as userDb from "../repository/users.repository.js";
import * as followDb from "../repository/followers.repository.js";
import ApiError from "../utils/ApiError.js";

// Follow a user
export const follow = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // user exist
  const user = await userDb.findById(userId);
  if (!user) throw new ApiError("user not exist", 404);

  const following = await followDb.findFollowedUser(req.user.id, userId);
  if (!following) await followDb.create(req.user.id, userId);

  res.status(200).json({ message: "Followed successfullyss" });
});
