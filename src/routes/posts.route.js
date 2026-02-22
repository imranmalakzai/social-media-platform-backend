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

// Get user posts
postRouter.route("/users/:userId/posts").get(Posts.getUserPosts);

// Get user post by Id
postRouter.route("/users/:userId/posts/:postId").get(Posts.getUserPostById);
