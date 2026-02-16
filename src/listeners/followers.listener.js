import * as notificationDb from "../repository/notifications.repository.js";
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
    console.log("error in user follower listener", error);
  }
});
