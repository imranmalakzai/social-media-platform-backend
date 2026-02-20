import { z } from "zod";

// Registeration
export const register = z.object({
  username: z
    .string("user name is required")
    .min(3, "user name must be more then 3 characters")
    .max(10, "user must not be more then 10 characters"),
  password: z
    .string("password is required")
    .min(8, "password must be at least 8 characters"),
  email: z.string("Email is required").email("Invalid Email Address"),
});
