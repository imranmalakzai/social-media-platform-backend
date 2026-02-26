import express from "express";
import * as User from "../controllers/follows.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const followRouter = express.Router();

followRouter.use(auth);

// Follow a user
followRouter.route("/users/me/follow/:userId").post(User.follow);

// Unfollow a user
followRouter.route("/users/me/follow/:userId").delete(User.unfollow);

//Get me following
followRouter.route("/users/me/following").get(User.getMeFollowing);

// Get my followers
followRouter.route("/users/me/followers").get(User.getMyFollowers);

//User Followers
followRouter.route("/users/:userId/followers").get(User.getUserFollowers);

//User Following
followRouter.route("/users/:userId/following").get(User.getUserFollowing);

export default followRouter;
