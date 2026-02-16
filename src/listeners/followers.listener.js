import * as notificationDb from "../repository/notifications.repository.js";
import { logger } from "../config/logger.config.js";
import { eventBus } from "../events/eventBus.js";

eventBus.on("user.followed", async ({ followerId, followingId }) => {
  try {
    await notificationDb.create({
      recipient_id: followingId,
      sender_id: followerId,
      type: "FOLLOW",
      post_id: null,
    });
  } catch (error) {
    logger.error("Notification creation failed", {
      followerId,
      followingId,
      error: error.message,
      stack: error.stack,
    });
  }
});
