import express from "express";

import { auth } from "../middleware/auth.middleware.js";
import * as comments from "../controllers/comments.controller.js";
import * as schema from "../validation/comments.valiation.js";
import { validate } from "../middleware/zod.middleware.js";

const commentRouter = express.Router({ mergeParams: true });

commentRouter.use(auth);

// create comments
commentRouter
  .route("/comments")
  .post(validate(schema.createPost), comments.createComment);

// Get all comments
commentRouter.route("/comments").get(comments.postComments);

// Delete a comment
commentRouter.route("/comments/:commentId").get(comments.deleteComment);

// Update a comment
commentRouter.route("/comments/:commentId").patch(comments.updateComment);

// Get a comment by Id
commentRouter.route("/comments/:commentId").get(comments.getCommentById);

export default commentRouter;
