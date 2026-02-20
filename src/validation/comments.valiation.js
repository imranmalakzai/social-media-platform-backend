import { z } from "zod";

export const createPost = z.object({
  parent_comment_id: z.string("parent comment id is required"),
  text: z.string().min(1, "comment text is required"),
});

export const updatePost = z.object({
  text: z.string().min("comment text is required"),
});
