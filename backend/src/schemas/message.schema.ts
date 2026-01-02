import { z } from "zod";

const mongoIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID format");

export const sendMessageSchema = z.object({
  body: z
    .object({
      text: z
        .string()
        .max(1000, "Message text length cannot exceed 1000 characters")
        .nullish(),
      image: z
        .string()
        .refine(
          (val) =>
            !val || val.startsWith("data:image/") || val.startsWith("http"),
          "Image must be a valid image URL or base64 data"
        )
        .nullish(),
    })
    .refine(
      (data) => data.text || data.image,
      "Either text or image must be provided"
    ),
  params: z.object({
    id: mongoIdSchema,
  }),
});

export const getMessagesSchema = z.object({
  params: z.object({
    id: mongoIdSchema,
  }),
});
