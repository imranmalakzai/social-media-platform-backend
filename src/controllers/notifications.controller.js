import { asyncHandler } from "../utils/asyncHandler.js";
import { addClient, removeClient } from "../SSE/sseManager.js";
import * as notificationDb from "../repository/notifications.repository.js";
import ApiError from "../utils/ApiError.js";

// Server side notification stream
export const notificationStream = asyncHandler(async (req, res) => {
  if (!req.user.id) {
    return res.status(200).json({ message: "please authenticate" });
  }

  const userId = req.user.id;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.flushHeaders();
  addClient(userId, res);

  req.on("close", () => {
    removeClient(userId);
  });
});

// Get All notifications
export const notifications = asyncHandler(async (req, res) => {
  const notifications = await notificationDb.findAll(req.user.id);
  res.status(200).json({ notifications: notifications || [] });
});

// Get a notifications by Id
export const notification = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  // notification exist
  const notification = await notificationDb.userNotificationById(
    notificationId,
    req.user.id,
  );
  if (!notification) throw new ApiError("Notification not exist", 404);
  await notificationDb.markRead(notificationId);

  res.status(200).json({ notification });
});

// Mark all notifications as read
export const readAll = asyncHandler(async (req, res) => {
  await notificationDb.markReadAll(req.user.id);
  res.status(200).json({ message: "read all " });
});
