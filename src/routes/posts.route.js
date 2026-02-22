import express from "express";
import { validate } from "../middleware/zod.middleware.js";
import { auth } from "../middleware/auth.middleware.js";
import * as Posts from "../controllers/posts.controller.js";
import * as schema from "../validation/posts.validation.js";

// initialize post router
const postRouter = express.Router();

//Get all public posts
postRouter.route("/posts").get(Posts.getPublicPosts);

// Get a post by Id
postRouter.route("/posts/:postId").get(Posts.getAPostById);

postRouter.use(auth);

// Get user posts
postRouter.route("/users/:userId/posts").get(Posts.getUserPosts);

// Get user post by Id
postRouter.route("/users/:userId/posts/:postId").get(Posts.getUserPostById);

// create a post
postRouter
  .route("/me/posts")
  .post(validate(schema.createPost), Posts.createPost);

// Get My post
postRouter.route("/me/posts").get(Posts.getMyPosts);

// Get my post by Id
postRouter.route("/me/posts/:postId").get(Posts.getMyPostById);

// update a post
postRouter
  .route("/me/posts/:postId")
  .patch(validate(schema.updatePost), Posts.updatePost);

// delete a post
postRouter.route("/me/posts/:postId").patch(Posts.deletePost);

// update post visibility
postRouter
  .route("/me/posts/:postId/visibility")
  .patch(Posts.updatePostVisibility);

export default postRouter;
