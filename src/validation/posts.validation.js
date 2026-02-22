import { z } from "zod";

export const createPost = z.object({
  caption: z
    .string("caption is required")
    .min(3, "caption must be more then 3 characters"),
  visibility: z.enum(
    ["public", "privite"],
    "visibilit should be public or privite",
  ),
});

export const updatePost = z.object({
  caption: z.string("Caption is required"),
});

export const updatePostVisibility = z.object({
  visibility: z.enum(["public", "privite"]),
});
