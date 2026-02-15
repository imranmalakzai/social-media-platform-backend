import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

import * as postDb from "../repository/posts.repository.js";
import * as hashtagDb from "../repository/hashtags.repository.js";
import * as postHashtagDb from "../repository/postHashtags.repository.js";

// Create a new post
export const createPost = asyncHandler(async (req, res) => {
  const { caption, visibility } = req.body;
  const image = req.file?.path;

  //  Create the post
  const post = await postDb.create({
    caption,
    image,
    user_id: req.user.id,
    visibility,
  });

  // Extract hashtags from caption (e.g., "#fun #coding")
  const hashtags = caption.match(/#[a-zA-Z0-9_]+/g) || []; // returns array or empty

  for (let tag of hashtags) {
    let hashtagRecord = await hashtagDb.findByName(tag);

    //  If hashtag doesn't exist, create it
    if (!hashtagRecord) {
      const newHashtag = await hashtagDb.create({ name: tag });
      hashtagRecord = { id: newHashtag, name: tag };
    }

    //  Link post and hashtag
    await postHashtagDb.create({
      post_id: post,
      hashtag_id: hashtagRecord.id,
    });
  }

  res.status(201).json({ message: "Post created successfully" });
});

// Update post
export const updatePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const image = req.file.path;
  const { caption } = req.body;

  //post exist
  const post = await postDb.findById(postId);
  if (!post || post.user_id.toString() !== req.user.id.toString()) {
    throw new ApiError("Invalid Request", 400);
  }

  // update
  const update = postDb.updatePost(caption, image, postId);

  // Extract hashtags from caption
  const hashtags = caption.match(/#[a-zA-Z0-9_]+/g) || [];

  for (let tag of hashtags) {
    let hashtagRecord = await hashtagDb.findByName(tag);

    //  If hashtag doesn't exist, create it
    if (!hashtagRecord) {
      const newHashtag = await hashtagDb.create({ name: tag });
      hashtagRecord = { id: newHashtag, name: tag };
    }

    //  Link post and hashtag
    await postHashtagDb.create({
      post_id: post,
      hashtag_id: hashtagRecord.id,
    });
  }

  if (update === 0) throw new ApiError("Internal server error", 500);
  res.status(200).json({ message: "post updated succesflly" });
});
