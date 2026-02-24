import { eventBus } from "../events/eventBus.js";
import { sendOtpEmail } from "../services/email.services.js";
import { logger } from "../config/logger.config.js";
import * as otpDb from "../repository/otp.repository.js";
import crypto from "crypto";

eventBus.on("RESET.PASSWORD", async ({ userId, email }) => {
  try {
    const otp = Math.floor(100000 * Math.random() * 6000000);
    const hashOtp = crypto.createHash("sha256").update(otp).digest("hex");
    await otpDb.create(userId, hashOtp, "RESET_PASSWORD");
    // sendOtpEmail(email, otp);
    console.log(otp);
  } catch (error) {
    logger.error("Error in Reset password listener", {
      error: error.message,
      stack: error.stack,
    });
  }
});
