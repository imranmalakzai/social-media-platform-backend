import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import * as notification from "../controllers/notifications.controller.js";

const notificationRouter = express.Router();

notificationRouter.use(auth);

notificationRouter
  .route("/notification/stream")
  .get(notification.notificationStream);

export default notificationRouter;
