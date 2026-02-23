import express from "express";

import * as User from "../controllers/stories.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const storyRouter = express.Router();

storyRouter.use(auth);

// create new story
storyRouter.route("/story").post(User.createStory);

// Get all story
storyRouter.route("/story").get(User.getAllStories);

// Get a story by Id
storyRouter.route("/story/:storyId").get(User.getStoryById);

// Get a story by Id
storyRouter.route("/story/:storyId").delete(User.deleteStory);

export default storyRouter;
