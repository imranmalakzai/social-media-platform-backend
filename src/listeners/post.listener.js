import { eventBus } from "../events/eventBus.js";
import * as followersDb from "../repository/followers.repository.js";
import * as notificationsDb from "../repository/notifications.repository.js";
import { logger } from "../config/logger.config.js";

eventBus.on("post.created", async ({ userId, postId }) => {
  try {
    const BATCH_SIZE = 500;
    let offset = 0;

    while (true) {
      const followers = await followersDb.getFollowersBatch(
        userId,
        BATCH_SIZE, // limit === batch_size
        offset,
      );

      if (!followers.length) break;

      const values = followers.map((follower) => ({
        recipient_id: follower.follower_id,
        sender_id: userId,
        type: "post.created",
        post_id: postId,
      }));
      await notificationsDb.bulkInsert(values);
    }
  } catch (error) {
    logger.error("error in added new post notification", {
      userId,
      postId,
      error: error.message,
      stack: error.stack,
    });
  }
});
