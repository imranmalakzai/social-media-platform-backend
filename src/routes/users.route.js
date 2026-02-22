import express from "express";
import * as Users from "../controllers/users.controller.js";
import * as Schema from "../validation/users.validation.js";
import { validate } from "../middleware/zod.middleware.js";
import * as rateLimit from "../middleware/rateLimit.middleware.js";
import { auth } from "../middleware/auth.middleware.js";

const userRouter = express.Router();

// register
userRouter
  .route("/auth/register")
  .post(validate(Schema.register), Users.register);

// Login
userRouter
  .route("/auth/login")
  .post(validate(Schema.login), rateLimit.loginLimiter, Users.login);

// Logout
userRouter.route("/auth/logout").post(Users.logout);

// Refresh Access token
userRouter.route("/auth/refresh-token").post(Users.getRefreshAcessToken);

// Verify-email
userRouter
  .route("/auth/verify-email")
  .post(
    validate(Schema.verifyEmail),
    rateLimit.otpVerifyLimiter,
    Users.verifyEmail,
  );

// Forgot-password
userRouter
  .route("/auth/forgot-password")
  .post(
    validate(Schema.forgetPassword),
    rateLimit.otpRequestLimiter,
    Users.forgetPassword,
  );

// Reset Password
userRouter
  .route("/auth/reset-password")
  .post(
    validate(Schema.resetPassword),
    rateLimit.otpVerifyLimiter,
    Users.resetPassword,
  );

// handle auth
userRouter.use(auth);

// Get Current user
userRouter.route("/me").get(Users.getLoggenUser);

// delete account
userRouter.route("/me").delete(Users.removeAccount);

// update profile
userRouter.route("/me/update-profile").patch(Users.updateProfile);

// change password
userRouter
  .route("/me/change-password")
  .patch(validate(Schema.changePassword), Users.updatePassword);

// change avatar
userRouter.route("/me/change-avatar").patch(Users.updateAvatar);

// change cover image image
userRouter.route("/me/change-coverimage").patch(Users.updateCoverImage);

// Get all users
userRouter.route("/users").get(Users.getAllUsers);

// Get a user by id
userRouter.route("/users/:userId").get(Users.getUserById);
