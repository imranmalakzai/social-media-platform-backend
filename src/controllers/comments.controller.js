import { asyncHandler } from "../utils/asyncHandler.js";
import * as postDb from "../repository/posts.repository.js";
import * as commentDb from "../repository/comments.repository.js";
import ApiError from "../utils/ApiError.js";

// Create comment
export const createComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { parent_comment_id, text } = req.body;

  // post exist ?
  const post = await postDb.findById(postId);
  if (!post) throw new ApiError("post not exist", 404);

  // create comment
  const comment = await commentDb.create({
    user_id: req.user.id,
    post_id: postId,
    parent_comment_id: parent_comment_id || null,
    text,
  });

  if (comment === 0) throw new ApiError("Internal server error", 500);
  res.status(201).json({ message: "comment added" });
});

// update comment
export const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { text } = req.body;

  // comment exist
  const comment = await commentDb.findById(commentId);
  const commentOwner = req.user.id.toString() === comment.id.toString();

  if (!comment || !commentOwner) {
    throw new ApiError("Invalid request", 400);
  }

  // update comment
  const result = await commentDb.update(text, commentId);
  if (result === 0) throw new ApiError("Interal server error", 500);

  res.status(200).json({ message: "comment updated successfully" });
});

// Delete comment
export const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  // comment exist
  const comment = await commentDb.findById(commentId);
  const owner = req.user.id.toString() === comment.id.toString();

  if (!comment || !owner) {
    throw new ApiError("Invalid request", 400);
  }

  // result
  const result = await commentDb.remove(commentId);
  if (!result) throw new ApiError("Interal server error", 500);

  res.status(200).json({ message: "Comment deleted successfully" });
});
