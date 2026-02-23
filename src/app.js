import express from "express";
import cors from "cors";
import "./listeners/index.js";
import * as env from "./config/env.config.js";
import cookieParser from "cookie-parser";

import users from "./routes/users.route.js";
import stories from "./routes/stories.route.js";
import savePosts from "./routes/savedPosts.route.js";
import posts from "./routes/posts.route.js";
import likes from "./routes/likes.route.js";
import follow from "./routes/follow.route.js";
import comments from "./routes/comments.route.js";

import { globalErrorHandler } from "./middleware/globalErrorHandler.middleware.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ credentials: true, origin: env.CORS_ORIGIN }));
app.use(cookieParser());

// Health endpoints
app.get("/", (req, res) => res.send("API is working fine"));

// api endpoints
app.use("/api/", users);
app.use("/api/", posts);
app.use("/api/", stories);
app.use("/api/", likes);
app.use("/api/", follow);
app.use("/api/", comments);
app.use("/api/", savePosts);

// Custom middlewares
app.use(globalErrorHandler);

export default app;
