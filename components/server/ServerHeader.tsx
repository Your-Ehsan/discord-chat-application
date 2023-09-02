"use client";
import { ServerWithMembers_ProfilesTypes } from "@/lib/types";
import { MemberRole } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  ChevronDownIcon,
  CodeSandboxLogoIcon,
  PlusCircledIcon,
  TrashIcon,
  AvatarIcon,
  GearIcon,
  Share1Icon,
} from "@radix-ui/react-icons";
import { useModalStore } from "@/hooks/useModalStore";

type ServerHeaderProps = {
  server: ServerWithMembers_ProfilesTypes;
  role?: MemberRole;
};

const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  const isAdmin: boolean = role === MemberRole.ADMIN,
    isModerator: boolean = isAdmin || role === MemberRole.MODERATOR;

  const { onOpen } = useModalStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild={true}>
        <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
          {server?.name}
          <ChevronDownIcon className="ml-auto mr-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
        {isModerator && (
          <DropdownMenuItem
            onClick={() => {
              onOpen("invite", { server: server });
            }}
            className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
          >
            Invite People
            <Share1Icon className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("editServer", { server })}
            className="px-3 py-2 text-sm cursor-pointer"
          >
            Server Settings
            <GearIcon className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("members", { server })}
            className="px-3 py-2 text-sm cursor-pointer"
          >
            Manage Members
            <AvatarIcon className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("createChannel", { server: server })}
            className="px-3 py-2 text-sm cursor-pointer"
          >
            Create Channel
            <PlusCircledIcon className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("deleteServer", { server })}
            className="text-rose-400 px-3 py-2 text-sm cursor-pointer"
          >
            Delete Server
            <TrashIcon className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("leaveServer", { server: server })}
            className="text-rose-400 px-3 py-2 text-sm cursor-pointer"
          >
            Leave Server
            <CodeSandboxLogoIcon className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerHeader;
