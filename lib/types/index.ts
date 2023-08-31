import { z } from "zod";
import { initialModalformSchema } from "../schemas";
import { Member, Profile, Server } from "@prisma/client";

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

export type ServerWithMembers_ProfilesTypes = Server & {
  Members: (Member & { profile: Profile })[];
} | null;
