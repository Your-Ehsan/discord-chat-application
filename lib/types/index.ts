import { z } from "zod";
import { CreateChannelSchema, serverModalformSchema } from "../schemas";
import { Channel, Member, Profile, Server } from "@prisma/client";
import { UseFormReturn } from "react-hook-form";

export type DBprofile = {
  id: string;
  userId: string;
  name: string;
  imageUrl: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
} | null;

export type serverModalformValuesTypes = z.infer<typeof serverModalformSchema>;
export type CreateChannelTypes = z.infer<typeof CreateChannelSchema>;

export type ServerWithMembers_ProfilesTypes =
  | (Server & {
      Members: (Member & { profile: Profile })[];
    })
  | null;

export type ServerFormType = UseFormReturn<
  {
    name: string;
    imageUrl: string;
  },
  any,
  undefined
>;

export type ModalType =
  | "createServer"
  | "invite"
  | "editServer"
  | "members"
  | "createChannel"
  | "leaveServer"
  | "deleteServer";

export type ModalData = {
  server?: Server | null;
};

export type ModalStore = {
  data: ModalData;
  type: ModalType | null;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
};

export type serverCollectionType = "channel" | "member";
