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
