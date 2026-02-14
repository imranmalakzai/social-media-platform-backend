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

// Unfollow a user
export const unfollow = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // user Exist
  const user = await userDb.findById(userId);
  if (!user) throw new ApiError("user not exist", 404);

  //is following
  const isFollowing = await followDb.findFollowedUser(req.user.id, userId);
  if (!isFollowing) throw new ApiError("please follow first", 400);

  // unfollow
  const result = await followDb.remove(req.user.id, userId);
  if (result === 0) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "unfollowed successfully" });
});

// Get user Followers
export const getUserFollowers = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // user exist
  const user = await userDb.findById(userId);
  if (!user) throw new ApiError("user not exist", 404);

  // Get user followers
  const followers = await followDb.findAllFollowers(userId);
  res.status(200).json({ followers: followers || [] });
});
