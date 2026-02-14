import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import * as userDb from "../repository/users.repository.js";
import * as likeDb from "../repository/likes.repository.js";
import * as postDb from "../repository/posts.repository.js";

// Like a post
export const like = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  // post exist ?
  const post = await postDb.findById(postId);
  if (!post) throw new ApiError("Post not exist", 404);

  //is already reacted ? if reacted Remove reaction else add Reaction
  const reacted = await likeDb.findById(req.user.id, postId);

  if (reacted) {
    const result = await likeDb.remove(req.user.id, postId);
    if (result === 0) throw new ApiError("Internal server error", 500);
    return res.status(204);
  }

  // Add reaction
  const result = await likeDb.create(req.user.id, postId);
  if (result === 0) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "post liked successfully" });
});

// liked post users
export const getUserLikedPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  //post exist
  const post = await postDb.findById(postId);
  if (!post) throw new ApiError("post not exist", 404);

  // users
  const users = await likeDb.findAllUsers(postId);
  res.status(200).json({ users: users || [] });
});
