import * as notificationsDb from "../repository/notifications.repository.js";
import { eventBus } from "../events/eventBus.js";
import { logger } from "../config/logger.config.js";

eventBus.on("post.liked", async ({ postId, sender_id, resiver_id }) => {
  try {
    await notificationsDb.create({
      post_id: postId,
      sender_id,
      resiver_id,
    });
  } catch (error) {
    logger.error("Notification creation failed in like a post", {
      postId,
      sender_id,
      resiver_id,
      error: error.message,
      stack: error.stack,
    });
  }
});
