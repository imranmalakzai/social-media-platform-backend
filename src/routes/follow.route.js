import express from "express";
import * as User from "../controllers/follows.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const followRouter = express.Router();

followRouter.use(auth);
// Follow a user
followRouter.route("/follow").post(User.follow);

// Unfollow a user
followRouter.route("/follow").delete(User.unfollow);

//User Followers
followRouter.route("/users/:userId/followers").get(User.getUserFollowers);

//User Following
followRouter.route("/users/:userId/following").get(User.getUserFollowing);

//Get me following
followRouter.route("/me/following").get(User.getMeFollowing);

// Get my followers
followRouter.route("/me/followers").get(User.getMyFollowers);

export default followRouter;
