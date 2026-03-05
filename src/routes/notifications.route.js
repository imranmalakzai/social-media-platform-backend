import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import * as notification from "../controllers/notifications.controller.js";

const notificationRouter = express.Router();

notificationRouter.use(auth);

// Reall Time notifications
notificationRouter
  .route("/me/notifications/stream")
  .get(notification.notificationStream);

// Get all notifications
notificationRouter.route("/me/notifications").get(notification.notifications);

// Get notification by Id && read notification
notificationRouter
  .route("/me/notifications/:notificaitonId")
  .get(notification.notification);

// Read all notificaitons
notificationRouter.route("/me/notifications/read-all");

export default notificationRouter;
