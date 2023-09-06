"use client";
import { cn } from "@/lib/utils";
import { Channel, ChannelType, MemberRole } from "@prisma/client";
import { Edit, Hash, Lock, Mic, TrashIcon, VideoIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import ActionTooltip from "../tooltips/ActionTooltip";
import { useModalStore } from "@/hooks/useModalStore";
import { ModalType, ServerWithMembers_ProfilesTypes } from "@/lib/types";
import Link from "next/link";
import { MouseEvent } from "react";

type ServerChannelProps = {
  channel: Channel;
  role: MemberRole | undefined;
  server: ServerWithMembers_ProfilesTypes;
};

const iconMap = {
  // TODO: convert this to gloabal icons for the channel types
  [ChannelType.TEXT]: Hash,
  [ChannelType.VIDEO]: VideoIcon,
  [ChannelType.AUDIO]: Mic,
};

const ServerChannel = ({ channel, role, server }: ServerChannelProps) => {
  const Router = useRouter(),
    Param = useParams();

  const Icon_ = iconMap[channel.type],
    { onOpen } = useModalStore(),
    onAction = (e: MouseEvent, action: ModalType) => {
      e.stopPropagation();
      e.preventDefault();
      onOpen(action, { channel: channel, server: server });
    };

  return (
    <Link href={`/servers/${Param?.serverId}/channels/${channel.id}`}>
      <button
        className={cn(
          "group p-2 rounded-md flex itesm-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition-all mb-1",
          Param?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700",
        )}
      >
        <Icon_ className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
        <span
          className={cn(
            "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition-all",
            Param?.channelId === channel.id &&
              "text-primary dark:text-zinc-200 dark:group-hover:text-white transition-all",
          )}
        >
          {channel.name}
        </span>
        {channel.name !== "general" && role !== "GUEST" && (
          <div className="ml-auto flex items-center gap-x-2">
            <ActionTooltip label="Edit" side="top">
              <Edit
                onClick={(e) => onAction(e, "editChannel")}
                className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition-all"
              />
            </ActionTooltip>
            <ActionTooltip label="Delete" side="top">
              <TrashIcon
                onClick={(e) => onAction(e, "deleteChannel")}
                className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-300 transition-all"
              />
            </ActionTooltip>
          </div>
        )}
        {channel.name === "general" && (
          <ActionTooltip label="This is default Channel">
            <Lock className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400 transition-all" />
          </ActionTooltip>
        )}
      </button>
    </Link>
  );
};

export default ServerChannel;
