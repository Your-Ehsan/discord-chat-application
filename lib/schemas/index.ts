import { z } from "zod";

/**
 * InitialModal formSchema
 */
export const initialModalformSchema = z.object({
  name: z.string().min(1, {
    message: "Server Name is Required",
  }),
  imageUrl: z.string().min(1, {
    message: "Srever Image is Required",
  }),
});
