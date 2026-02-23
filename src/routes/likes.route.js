import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import * as Post from "../controllers/likes.controller.js";

const likesRouter = express.Router();

// like a post
likesRouter.route("/likes/post/:postId").post(auth, Post.like);

// Get all users liked post
likesRouter.route("/likes/post/:postId").get(auth, Post.getUserLikedPost);

export default likesRouter;
