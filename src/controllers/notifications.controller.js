import { asyncHandler } from "../utils/asyncHandler.js";
import { addClient, removeClient } from "../SSE/sseManager.js";
import * as notificationDb from "../repository/notifications.repository.js";

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
