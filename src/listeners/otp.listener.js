import { eventBus } from "../events/eventBus.js";
import { logger } from "../config/logger.config.js";
import * as otpDb from "../repository/opt.repository.js";
import { sendOtpEmail } from "../services/email.services.js";
import crypto from "crypto";

// Send otp message for verification
eventBus.on("USER.REGISTERED", async ({ userId, email }) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    await otpDb.create(userId, otpHash, "VERIFY_EMAIL");
    // send otp email
    await sendOtpEmail(email, otp);
  } catch (error) {
    logger.error("Error in send opt event", {
      userId,
      error: error.message,
      stack: error.stack,
    });
  }
});

eventBus.on("PASSWORD.RESET", async ({ userId, email }) => {
  try {
    const otp = Math.floor(100000 * Math.random() * 900000).toString();
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    // save in db
    await otpDb.create(userId, otpHash, "RESET_PASSWORD");
    // send email
    await sendOtpEmail(email, otp);
  } catch (error) {
    logger.error("ERROR IN RESET PASSWORD listener", {
      userId,
      email,
      error: error.message,
      stack: error.stack,
    });
  }
});
