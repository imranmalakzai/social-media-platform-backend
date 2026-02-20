import { z } from "zod";

export const createPost = z.object({
  parent_comment_id: z.string("parent comment id is required"),
  text: z.string().min(1, "comment text is required"),
});
