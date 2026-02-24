import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import * as userDb from "../repository/users.repository.js";
import * as generate from "../utils/jwt.js";
import * as env from "../config/env.config.js";
import * as otpDb from "../repository/otp.repository.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { eventBus } from "../events/eventBus.js";
import ApiError from "../utils/ApiError.js";

// Register a user
export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // prevent dublicate email
  const user = await userDb.findByEmail(email);
  if (user) throw new ApiError("Email is already in used", 400);

  // hash password
  const hashPassword = await bcrypt.hash(password, 10);

  // result
  const result = await userDb.create({
    username,
    email,
    password: hashPassword,
  });

  if (result === 0) throw new ApiError("Internal server error", 500);

  setImmediate(() => {
    eventBus.emit("USER.REGISTERED", { userId: result, email });
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

// Forget password
export const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // user exist
  const user = await userDb.findByEmail(email);
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

// Reset Password
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  // user exist
  const user = await userDb.findByEmail(email);
  if (!user) throw new ApiError("User not exist", 404);

  const otpHash = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex")
    .toString();
  // valid otp
  const isValid = await otpDb.findValidOtp(user.id, "RESET.PASSWORD");

  if (!isValid || otpHash !== isValid.otp_hash) {
    throw new ApiError("Invalid otp or otp is expired", 400);
  }

  // hashPassword
  const hashPassword = await bcrypt.hash(newPassword, 10);

  const updatePassword = await userDb.updatePassword(hashPassword, user.id);
  if (updatePassword === 0) throw new ApiError("Interal server error", 500);

  await otpDb.consumeOtp(isValid.id);

  res.status(200).json({ message: "Password reset successfully" });
});

// login as an existing account
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // use exist
  const user = await userDb.findByEmail(email);
  if (!user) throw new ApiError("Invalid cridential", 400);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError("Invalid cridential", 400);

  // if not verified access denied
  if (user.is_verified.toString() !== "1") {
    throw new ApiError("Access denied please verify your email first", 403);
  }

  // genereate tokens
  const accessToken = await generate.accessToken(user);
  const refreshToken = await generate.refreshToken(user);

  // save refresh token in db
  await userDb.saveToken(refreshToken, user.id);

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
  const user = jwt.verify(refreshToken, env.JWT_REFRESH_TOKEN_SECRET);

  // compare token
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

// Get loggen user
export const getLoggenUser = asyncHandler(async (req, res) => {
  const user = await userDb.findById(req.user.id);
  res.status(200).json({ user });
});

// change password
export const updatePassword = asyncHandler(async (req, res) => {
  const { newPassword, oldPassword } = req.body;

  const user = await userDb.findById(req.user.id);

  if (oldPassword !== user.password) {
    throw new ApiError("Invalid old password", 400);
  }

  // hash password
  const password = await bcrypt.hash(newPassword, 10);

  // update password
  const result = await userDb.updatePassword(password, req.user.id);
  if (result === 0) throw new ApiError("Interal server error", 500);

  res.status(200).json({ message: "password updated succesfully" });
});

// update profile (username,bio)
export const updateProfile = asyncHandler(async (req, res) => {
  const { username, bio } = req.body;

  const result = await userDb.updateProfile(username, bio, req.user.id);
  if (result === 0) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "profile updated successfully" });
});

// change avatar
export const updateAvatar = asyncHandler(async (req, res) => {
  const avatar = req.file?.path;

  if (!avatar) throw new ApiError("please select an image", 400);

  // result
  const result = await userDb.updateAvatar(avatar, req.user.id);
  if (!result) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "avatar updated successfully" });
});

// update cover image
export const updateCoverImage = asyncHandler(async (req, res) => {
  const image = req.file?.path;

  if (!image) throw new ApiError("please select on image", 400);

  // result
  const result = await userDb.updateCoverImage(image, req.user.id);
  if (result === 0) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "profile udpated successfully" });
});
