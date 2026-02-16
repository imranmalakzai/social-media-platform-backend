import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import * as storyDb from "../repository/stories.repository.js";

//create story
export const createStory = asyncHandler(async (req, res) => {
  const image = req.file?.path;

  // create storie
  const story = await storyDb.create({ image, user_id: req.user.id });
  if (story === 0) throw new ApiError("Interal server error", 500);

  res.status(200).json({ message: "published" });
});

// delete one story
export const deleteStory = asyncHandler(async (req, res) => {
  const { storyId } = req.story;

  // story exist
  const story = await storyDb.findById(storyId);
  const owner = req.user.id.toString() === story.user_id;

  if (!story || !owner) throw new ApiError("Invalid request", 400);

  // delete story
  const result = await storyDb.remove(storyId);
  if (result === 0) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "story removed successfully" });
});

// Get all stories
export const getAllStories = asyncHandler(async (req, res) => {
  const stories = await storyDb.findAll();
  res.status(200).json({ stories: stories || [] });
});
