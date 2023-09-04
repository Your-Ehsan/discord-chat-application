"use client";
import {
  ServerWithMembers_ProfilesTypes,
  serverCollectionType,
} from "@/lib/types";
import { ChannelType, MemberRole } from "@prisma/client";
import { useModalStore } from "@/hooks/useModalStore";
import ActionTooltip from "../tooltips/ActionTooltip";
import Icon from "../Icon";

type ServerCollectionSectionProps = {
  label: string;
  role: MemberRole | undefined;
  sectionType: serverCollectionType;
  channelType?: ChannelType;
  server?: ServerWithMembers_ProfilesTypes;
};

const ServerCollectionSection = ({
  channelType,
  label,
  role,
  sectionType,
  server,
}: ServerCollectionSectionProps) => {
  const { onOpen } = useModalStore();
  return (
    <div className="flex items-center justify-between py-3">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== "GUEST" && sectionType === "channel" && (
        <ActionTooltip label={`create channel`} side="right">
          <button
            onClick={() =>
              onOpen("createChannel", { channelType: channelType })
            }
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition-all"
          >
            <Icon name="plus" className="w-4 h-4" />
          </button>
        </ActionTooltip>
      )}
      {role === "ADMIN" && sectionType === "member" && (
        <ActionTooltip label={`manage members`} side="right">
          <button
            onClick={() => onOpen("members", { server: server })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition-all"
          >
            <Icon name="settings" className="w-4 h-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};

export default ServerCollectionSection;
