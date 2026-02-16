import * as notificationsDb from "../repository/notifications.repository.js";
import { logger } from "../config/logger.config.js";
import { eventBus } from "../events/eventBus.js";

eventBus.on("COMMET", async (data) => {
  try {
    await notificationsDb.create({
      sender_id: data.sender_id,
      recipient_id: data.recipient_id,
      type: data.type,
      post_id: data.post_id,
    });
  } catch (error) {
    // professional logging instead of console.error
    logger.error("Notification creation failed", {
      senderId: data.sender_id,
      recipientId: data.recipient_id,
      error: error.message,
      stack: error.stack,
    });
  }
});
