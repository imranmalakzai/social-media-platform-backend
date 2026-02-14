import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as userDb from "../repository/users.repository.js";
import ApiError from "../utils/ApiError.js";
import * as generate from "../utils/jwt.js";
import * as env from "../config/env.config.js";

// Register a user
export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // prevent dublicate email
  const user = await userDb.findByEmail(email);
  if (user) throw new ApiError("Email is already in used", 400);

  const result = await userDb.create({ username, email, password });
  if (result === 0) throw new ApiError("Internal server error", 500);

  res.status(201).json({ message: "Registration successed" });
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
