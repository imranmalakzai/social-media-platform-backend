import cron from "node-cron";
import { logger } from "../config/logger.config.js";
import * as optDb from "../repository/otp.repository.js";

cron.schedule("0  * * * *", async () => {
  try {
    await optDb.deleteExpiredOtps();
    logger.info("Expired OTPs cleaned up");
  } catch (error) {
    logger.error("Error cleaning up expired OTPs:", error);
  }
});
