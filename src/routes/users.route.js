import express from "express";
import * as Users from "../controllers/users.controller.js";
import * as Schema from "../validation/users.validation.js";
import { validate } from "../middleware/zod.middleware.js";
import { auth } from "../middleware/auth.middleware.js";

const userRouter = new express.Router();

// register
userRouter.route("/auth/register").post(Users.register);

// Login
userRouter.route("/auth/login").post(Users.login);

// Logout
userRouter.route("/auth/logout").post(Users.logout);

// Refresh Access token
userRouter.route("/auth/refresh-token").post(Users.getRefreshAcessToken);

// Verify-email
userRouter.route("/auth/verify-email").post(Users.verifyEmail);

// Forgot-password
userRouter.route("/auth/forgot-password").post(Users.forgetPassword);

// Reset Password
userRouter.route("/auth/reset-password").post(Users.resetPassword);
