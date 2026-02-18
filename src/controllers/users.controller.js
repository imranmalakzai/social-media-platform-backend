import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as userDb from "../repository/users.repository.js";
import ApiError from "../utils/ApiError.js";
import * as generate from "../utils/jwt.js";
import * as env from "../config/env.config.js";
import * as otpDb from "../repository/opt.repository.js";
import { eventBus } from "../events/eventBus.js";

// Register a user
export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // prevent dublicate email
  const user = await userDb.findByEmail(email);
  if (user) throw new ApiError("Email is already in used", 400);

  const result = await userDb.create({ username, email, password });
  if (result === 0) throw new ApiError("Internal server error", 500);

  setImmediate(() => {
    eventBus.evmit("USER.REGISTERED", { user_id: result, email });
  });

  res.status(201).json({ message: "Account create . opt sent to your email" });
});

// Verify email
export const verifyEmail = asyncHandler(async (req, res) => {
  const { otp, email } = req.body;

  // find user
  const user = await userDb.findByEmail(email);
  if (!user) throw new ApiError("user not exist", 404);

  //  Hash OTP
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  //is valid otp
  const isValid = await otpDb.findValidOtp(user.id, "VERIFY_EMAIL");

  if (!isValid || otpHash !== isValid.otp_hash) {
    throw new ApiError("Invalid or opt is expired", 400);
  }

  await otpDb.consumeOtp(isValid.id);
  await userDb.verifyUser(user.id);

  res.status(200).json({ message: "Email Verified" });
});

// Reset Password
export const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // user exist
  const user = userDb.findByEmail(email);
  if (!user) throw new ApiError("user not exist", 404);

  setImmediate(() => {
    eventBus.emit("RESET.PASSWORD", {
      userId: user.id,
      email: user.email,
    });
  });
  res
    .status(200)
    .json({ message: "otp send to your email check your email address" });
});

// login as an existing account
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // use exist
  const user = await userDb.findByEmail(email);
  if (!user) throw new ApiError("Invalid cridential", 400);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError("Invalid cridential", 400);

  // genereate tokens
  const accessToken = generate.accessToken(user);
  const refreshToken = generate.refreshToken(user);

  // options
  const options = {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 60 * 60 * 1000,
  };

  res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .json({ accessToken, user });
});

// logout
export const logout = asyncHandler(async (req, res) => {
  const refreshToken = await req.cookies.refreshToken;
  await userDb.updateToken(refreshToken);
  // options
  const options = {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 60 * 60 * 1000,
  };

  res
    .status(200)
    .clearCookie("refreshToken", options)
    .json({ message: "logout successfully" });
});

// Refresh access Token
export const getRefreshAcessToken = asyncHandler(async (req, res) => {
  const refreshToken = await req.cookies.refreshToken;

  // check in db for token
  const token = await userDb.findByToken(refreshToken);
  const user = jwt.verify(token, env.JWT_REFRESH_TOKEN_SECRET);

  // comparete token
  if (!refreshToken || !token || !user || user.id !== token.id) {
    throw new ApiError("Invalid Token", 401);
  }

  // Accesstoken
  const accesstoken = await generate.accessToken(user);
  if (!accesstoken) throw new ApiError("Internal server error", 500);

  res.status(200).json({ accesstoken });
});

// Get a user by id
export const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  //find user
  const user = await userDb.findById(userId);
  if (!user) throw new ApiError("user not exist", 404);

  const { id, username, profile_image, background_image } = user;

  res
    .status(200)
    .json({ user: { id, username, profile_image, background_image, email } });
});

// Delete Account
export const removeAccount = asyncHandler(async (req, res) => {
  const result = await userDb.remove(req.user.id);
  if (result === 0) throw new ApiError("unable to delete account", 500);
  res.status(200).json({ message: "Account deleted successfully" });
});

// Get all users
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userDb.find();
  res.status(200).json(users);
});
