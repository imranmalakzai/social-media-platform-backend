import * as notificationsDb from "../repository/notifications.repository.js";
import { eventBus } from "../events/eventBus.js";

eventBus.on("post.liked", async ({ postId, sender_id, resiver_id }) => {
  try {
    await notificationsDb.create({
      post_id: postId,
      sender_id,
      resiver_id,
    });
  } catch (error) {
    console.log("Error inside the like listener");
  }
});
