import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import * as storyDb from "../repository/stories.repository.js";

//create story
export const createStory = asyncHandler(async (req, res) => {
  const image = req.file?.path;
  if (!image) throw new ApiError("Please select an image", 400);

  // create storie
  const story = await storyDb.create({ image, user_id: req.user.id });
  if (story === 0) throw new ApiError("Interal server error", 500);

  res.status(200).json({ message: "published" });
});

// delete one story
export const deleteStory = asyncHandler(async (req, res) => {
  const { storyId } = req.params;

  // story exist
  const story = await storyDb.findUserStoryById(storyId, req.user.id);
  if (!story) throw new ApiError("Story not exit", 404);

  const result = await storyDb.remove(storyId);
  if (result === 0) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "story removed successfully" });
});

// Get all stories
export const getAllStories = asyncHandler(async (req, res) => {
  const stories = await storyDb.findAll();
  res.status(200).json({ stories: stories || [] });
});

// Get a story by id
export const getStoryById = asyncHandler(async (req, res) => {
  const { storyId } = req.params;

  // story exist
  const story = await storyDb.findAll(storyId);
  if (!story) throw new ApiError("story not exist");

  res.status(200).json({ story: story || [] });
});
