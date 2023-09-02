import {
  ServerWithMembers_ProfilesTypes,
  serverCollectionType,
} from "@/lib/types";
import { ChannelType, MemberRole } from "@prisma/client";
import ActionTooltip from "../tooltips/ActionTooltip";
import Icon from "../Icon";
import { useModalStore } from "@/hooks/useModalStore";

type ServerCollectionSectionProps = {
  label: string;
  role: MemberRole | undefined;
  sectionType: serverCollectionType;
  channelType: ChannelType;
  server: ServerWithMembers_ProfilesTypes;
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
    <div className="flex items-center justify-center py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== "GUEST" && sectionType === "channel" && (
        <ActionTooltip label={`create channel`} side="right">
          <button
            onClick={() => onOpen("createChannel")}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition-all"
          >
            <Icon name="plus" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};

export default ServerCollectionSection;
