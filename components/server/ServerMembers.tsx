"use client";
import { ServerWithMembers_ProfilesTypes } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Member, MemberRole, Profile } from "@prisma/client";
import { Shield, User } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import UserAvatar from "../UserAvatar";

type ServerMembersProps = {
  member: Member & { profile: Profile };
  server: ServerWithMembers_ProfilesTypes;
};

const roleIcon = {
  [MemberRole.GUEST]: <User className="h-4 w-4 ml-2 text-zinc-400" />,
  [MemberRole.ADMIN]: <Shield className="h-4 w-4 ml-2 text-rose-400" />,
  [MemberRole.MODERATOR]: <User className="h-4 w-4 ml-2 text-indigo-400" />,
};

const ServerMembers = ({ member, server }: ServerMembersProps) => {
  const Route = useRouter(),
    Param = useParams(),
    icon = roleIcon[member.role];
  return (
    <button
      className={cn(
        "group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition-all mb-1",
        Param?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700/50 ",
      )}
    >
      <UserAvatar
        src={member.profile.imageUrl}
        className="h-6 w-6 md:w-8 md:h-8"
      />
      <span
        className={cn(
          "font-semibold text-sm text-zinc-400 dark:group-hover:text-zinc-300 transition-all",
          Param?.channelId === member.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white",
        )}
      >
        {member.profile.name}
      </span>
      {icon}
    </button>
  );
};

export default ServerMembers;
