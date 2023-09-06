import { ChannelType } from "@prisma/client";
import { z } from "zod";

/**
 * InitialModal and create server formSchema
 */

export const serverModalformSchema = z.object({
  name: z.string().min(1, {
    message: "Server Name is Required",
  }),
  imageUrl: z.string().min(1, {
    message: "Server Image is Required",
  }),
});

/**
 * Create channel schema for create modal
 */

export const CreateChannelSchema = z.object({
  type: z.nativeEnum(ChannelType),
  name: z
    .string({
      required_error: "channel name is required",
    })
    .min(3, {
      message: "minimum 3 characters required!",
    })
    .refine((name) => name !== "general", {
      message: "Channel name cannot be general",
    }),
});

/**
 * schema for input to send message in
 * chat or shannel section
 */

export const ChatInputSchema = z.object({
  content: z.string().min(1, { message: "empty message are not sendable" }),
  // fileUrl: z.string().optional()
});

/**
 * schema for input to send message in
 * chat or shannel section
 */
// TODO: make this form better with some better user experience
export const FileInputSchema = z.object({
  fileUrl: z.string().url({
    message: "image url is not valid",
  }),
});
