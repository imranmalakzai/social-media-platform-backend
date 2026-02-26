import express from "express";
import { validate } from "../middleware/zod.middleware.js";
import { upload } from "../config/multer.config.js";
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

// create a post
postRouter
  .route("/users/me/posts")
  .post(upload.single("image"), Posts.createPost);

// Get My post
postRouter.route("/users/me/posts").get(Posts.getMyPosts);

// Get my post by Id
postRouter.route("/users/me/posts/:postId").get(Posts.getMyPostById);

// update a post
postRouter
  .route("/users/me/posts/:postId")
  .patch(validate(schema.updatePost), Posts.updatePost);

// delete a post
postRouter.route("/users/me/posts/:postId").patch(Posts.deletePost);

// update post visibility
postRouter
  .route("/users/me/posts/:postId/visibility")
  .patch(validate(schema.updatePostVisibility), Posts.updatePostVisibility);

// Get user posts
postRouter.route("/users/:userId/posts").get(Posts.getUserPosts);

// Get user post by Id
postRouter.route("/users/:userId/posts/:postId").get(Posts.getUserPostById);

export default postRouter;
