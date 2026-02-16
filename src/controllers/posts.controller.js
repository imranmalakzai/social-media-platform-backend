import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

import * as postDb from "../repository/posts.repository.js";
import * as userDb from "../repository/users.repository.js";
import * as hashtagDb from "../repository/hashtags.repository.js";
import * as postHashtagDb from "../repository/postHashtags.repository.js";
import { eventBus } from "../events/eventBus.js";

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

    // emit event for notification handling
    setImmediate(() => {
      eventBus.emit("post.created", {
        userId: req.user.id,
        postId: post,
      });
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

// delete post
export const deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  // post exist
  const post = postDb.findById(postId);
  if (!post) throw new ApiError("post not exist", 404);

  // is owner
  const owner = req.user.id.toString() === post.user_id.toString();
  if (!owner) throw new ApiError("Access denied", 403);

  // result
  const result = await postDb.remove(postId);
  if (result === 0) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "post delete successfully" });
});

// update post visibility
export const updatePostVisibility = asyncHandler(async (req, res) => {
  const { visibility } = req.body;

  const result = await postDb.changeVisibility(visibility);
  if (result === 0) throw new ApiError("Interal server error", 500);

  res.status(200).json({ message: "visibility updated successfully" });
});

// Get all public posts
export const getPublicPosts = asyncHandler(async (req, res) => {
  const posts = await postDb.findAll();
  res.status(200).json({ posts: posts || [] });
});

// Get a user public posts
export const getUserPosts = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  //user exist
  const user = await userDb.findById(userId);
  if (!user) throw new ApiError("user not exist", 404);

  const posts = await postDb.findUserPosts(userId);
  res.status(200).json({ posts: posts || [] });
});

// Get my posts
export const getMyPosts = asyncHandler(async (req, res) => {
  const posts = await postDb.findMyPosts(req.user.id);
  res.status(200).json({ posts: posts || [] });
});

// Get a user post by id
export const getAPostById = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  // find post
  const post = await postDb.findUserPostById(postId);
  if (!post) throw new ApiError("post not exist", 404);

  res.status(200).json({ post });
});

// Get my post by id
export const getMyPostById = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  // find post
  const post = await postDb.findMypostById(req.user.id, postId);
  if (!post) throw new ApiError("post not exist", 404);

  res.status(200).json({ post });
});
