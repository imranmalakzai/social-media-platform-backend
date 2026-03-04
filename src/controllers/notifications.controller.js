import { asyncHandler } from "../utils/asyncHandler.js";
import { addClient, removeClient } from "../SSE/sseManager.js";

// Server side notification stream
export const notificationStream = asyncHandler(async () => {
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
