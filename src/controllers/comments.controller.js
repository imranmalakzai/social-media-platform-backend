import { asyncHandler } from "../utils/asyncHandler.js";
import * as postDb from "../repository/posts.repository.js";
import * as commentDb from "../repository/comments.repository.js";
import ApiError from "../utils/ApiError.js";

// Create comment
export const create = asyncHandler(async (req, res) => {
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
