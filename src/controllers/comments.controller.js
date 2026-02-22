import { asyncHandler } from "../utils/asyncHandler.js";
import * as postDb from "../repository/posts.repository.js";
import * as commentDb from "../repository/comments.repository.js";
import ApiError from "../utils/ApiError.js";
import { eventBus } from "../events/eventBus.js";

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

  setImmediate(() => {
    eventBus.emit({
      type: "COMMENT",
      sender_id: req.user.id,
      resiver_id: post.user_id,
      post_id: post.id,
    });
  });

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
  const { postId } = req.params;
  const { commentId } = req.params;

  //post exist
  const post = await postDb.findById(postId);
  if (!post) throw new ApiError("Post not exist", 404);

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

// Get all comments of posts
export const postComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  //post exist
  const post = await postDb.findById(postId);
  if (!post) throw new ApiError("post not exist", 404);

  //post comments
  const comments = await commentDb.postComments(postId);
  res.status(200).json({ comments: comments || [] });
});

// Get a comment by Id
export const getCommentById = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  // comment exist
  const comment = await commentDb.findById(commentId);
  if (!comment) throw new ApiError("comment not exist", 404);

  res.status(200).json({ comment });
});
