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

export const login = z.object({
  email: z.string("Email Address is Required").email("Invalid Email address"),
  password: z.string().min(1, "password is required"),
});

export const verifyEmail = z.object({
  email: z.string("Email address is required").email("Invalid Email Address"),
  otp: z
    .string()
    .length(6, "OTP must be exctly 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});
