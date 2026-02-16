import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import * as archiveDb from "../repository/savedPosts.repository.js";
import * as postDb from "../repository/posts.repository.js";

// Save a post
export const savePosts = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  // post exist
  const post = postDb.findById(postId);
  if (!post) throw new ApiError("Post not exist", 404);

  // is already saved ?
  const savePost = archiveDb.findById(postId);
  if (savePost) {
    return res.status(200).json({ message: "Post Saved successfully" });
  }

  const archive = archiveDb.create({ user_id: req.user.id, post_id: postId });
  if (archive === 0) throw new ApiError("Interanal server error", 500);

  res.status(200).json({ message: "Post Saved successfully" });
});

// Delete a saved post
export const deleteSavePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  // post exist
  const savedPost = archiveDb.findById(postId, req.user.id);
  if (!savedPost) throw new ApiError("saved post not exist", 404);

  // delete
  const result = await archiveDb.remove(postId);
  if (result === 0) throw new ApiError("Interal server error", 500);

  res.status(200).json({ message: "saved post removed" });
});
