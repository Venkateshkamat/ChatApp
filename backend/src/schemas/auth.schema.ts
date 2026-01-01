import { z } from "zod";

export const signupSchema = z.object({
  body: z.object({
    fullName: z
      .string()
      .min(1, "Full name is required")
      .min(2, "Full name must be atleast 2 character's long")
      .max(50, "Full name cannot be more than 49 characters"),
    email: z.email("Invalid email format").min(1, "Email is required"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be atleast 6 characters long")
      .max(20, "Password cannot be more than 19 characters long"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email("Invalid email format").min(1, "Email is required"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be atleast 6 characters")
      .max(20, "Password cannot be more than 19 characters"),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    profilePic: z
      .string()
      .min(1, "Profile picture is required")
      .refine(
        (val) =>
          val.startsWith("data:image/") ||
          val.startsWith("http") ||
          val.startsWith("https"),
        "Profile picture must be a valid image URL or base64 data"
      ),
  }),
});
