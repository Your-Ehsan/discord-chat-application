import { Member, MemberRole, Profile } from "@prisma/client";
import UserAvatar from "../UserAvatar";
import ActionTooltip from "../tooltips/ActionTooltip";
import {
  EditIcon,
  FileIcon,
  ShieldAlert,
  ShieldCheck,
  TrashIcon,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type ChatMessageProp = {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timeStamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
};

const roleIcons = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-rose-400" />,
};

const ChatMessage = ({
  content,
  currentMember,
  deleted,
  fileUrl,
  id,
  isUpdated,
  member,
  socketQuery,
  socketUrl,
  timeStamp,
}: ChatMessageProp) => {
  const [Edit, setEdit] = useState<boolean>(false),
    [Delete, setDelete] = useState<boolean>(false);

  const fileType = fileUrl?.split(".").pop();

  const isAdmin = currentMember.role === MemberRole.ADMIN,
    isModerator = currentMember.role === MemberRole.MODERATOR,
    isOwner = currentMember.id === member.id;

  const canDeleteMessage = (!deleted && !isAdmin) || isModerator || isOwner,
    canEditMesage = !deleted && !isOwner && !fileUrl;

  const isPdf = fileType === "pdf" && fileUrl,
    isImg = !isPdf && fileUrl;

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition-all w-full ">
      <div className="group flex gap-x-2 items-center w-full">
        <div className="cursor-pointer hover:drop-shadow-md transition-all ">
          <UserAvatar src={member?.profile?.imageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <span className="font-semibold text-sm hover:underline cursor-pointer transition-all">
                {member.profile.name}
              </span>
              <ActionTooltip label={member.role}>
                {roleIcons[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-300">
              {timeStamp}
            </span>
          </div>
          {isImg && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferef"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center  bg-secondary h-48 w-48 "
            >
              <Image
                src={fileUrl}
                alt={content}
                fill
                className="object-center"
              />
            </a>
          )}
          {isPdf && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                Pdf file
              </a>
            </div>
          )}
          {!fileUrl && !Edit && (
            <span
              className={cn(
                "text-sm text-zinc-600 dark:text-zinc-300 ",
                deleted &&
                  "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1",
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </span>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm ">
          {canEditMesage && (
            <ActionTooltip label="Edit">
              <EditIcon className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-all " />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <TrashIcon className="cursor-pointer ml-auto w-4 h-4 text-rose-400 hover:text-rose-500 transition-all " />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
