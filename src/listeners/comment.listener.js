import * as notificationsDb from "../repository/notifications.repository.js";
import { eventBus } from "../events/eventBus.js";

eventBus.on("COMMET", async (data) => {
  try {
    await notificationsDb.create({
      sender_id: data.sender_id,
      resiver_id: data.resiver_id,
      type: data.type,
      post_id: data.post_id,
    });
  } catch (error) {
    console.log("Error in notification comment listener");
  }
});
