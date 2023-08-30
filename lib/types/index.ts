import { z } from "zod";
import { initialModalformSchema } from "../schemas";

export type DBprofile = {
  id: string;
  userId: string;
  name: string;
  imageUrl: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
} | null;

export type initialModalformValuesTypes = z.infer<
  typeof initialModalformSchema
>;
