import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as socketServer } from "socket.io";
import { z } from "zod";
import {
  ChatInputSchema,
  CreateChannelSchema,
  FileInputSchema,
  serverModalformSchema,
} from "../schemas";
import {
  Channel,
  ChannelType,
  Member,
  Message,
  Profile,
  Server,
} from "@prisma/client";
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
  | "deleteServer"
  | "deleteChannel"
  | "editChannel"
  | "messageFile"
  | "deleteMessage";

export type ModalData = {
  server?: Server | null;
  channelType?: ChannelType | undefined;
  channel?: Channel | undefined;
  apiUrl?: string;
  query?: Record<string, any>;
};

export type ModalStore = {
  data: ModalData;
  type: ModalType | null;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
};

export type serverCollectionType = "channel" | "member";

export type chatType = "channel" | "chat";
export type chatParamKey = "channelId" | "chatId";

export type NextApiResponseSocketServer = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: socketServer;
    };
  };
};

export type ChatInputSchemaType = z.infer<typeof ChatInputSchema>;
export type FileInputSchemaType = z.infer<typeof FileInputSchema>;

export type MessageWithMember_Profile = Message & {
  member: Member & {
    profile: Profile;
  };
};
