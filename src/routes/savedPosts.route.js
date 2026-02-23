import express from "express";
import * as archive from "../controllers/savedPosts.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const archiveRouter = express.Router();

archiveRouter.use(auth);

// Get my saved posts
archiveRouter.route("/me/saved-posts").get(archive.getSavedPosts);

// Save a post
archiveRouter.route("/me/saved-posts").post(archive.savePosts);

// Delete a saved post
archiveRouter.route("/me/saved-posts/:postId").delete(archive.deleteSavePost);

// Get a save post by Id
archiveRouter.route("/me/saved-posts/:postId").get(archive.getSavedPostById);

export default archiveRouter;
