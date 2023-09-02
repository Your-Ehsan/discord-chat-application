"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModalStore } from "@/hooks/useModalStore";
import {
  BackpackIcon,
  ExitIcon,
  PersonIcon,
  QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";

import { ScrollArea } from "../ui/scroll-area";
import { ServerWithMembers_ProfilesTypes } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import UserAvatar from "../UserAvatar";
import Icon from "@/components/Icon";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteUserFromServer } from "@/lib/actions/deleteUserFromServer";
import { changeMemberRole } from "@/lib/actions/changeMemberRole";

const roleIconMap = {
  GUEST: <Icon name="user-circle" className="h-4 w-4 ml-2 text-zinc-400" />,
  MODERATOR: (
    <Icon name="shield-ellipsis" className="h-4 w-4 ml-2 text-indigo-500" />
  ),
  ADMIN: <Icon name="shield" className="h-4 w-4 text-rose-500" />,
};

const MembersModal = () => {
  const [LoadingId, setLoadingId] = useState<string>(""),
    Router = useRouter();

  const { isOpen, onClose, type, data, onOpen } = useModalStore(),
    { server } = data as { server: ServerWithMembers_ProfilesTypes },
    IsModalOPen: boolean = isOpen && type === "members";

  return (
    <Dialog open={IsModalOPen} onOpenChange={onClose}>
      <DialogContent className="p-8 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl capitalize">
            server members
          </DialogTitle>
          <DialogDescription className="text-zinc-500 capitalize">
            Give special permissions to your server members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.Members?.map(({ profile, role, id, profileId }) => (
            <div key={id} className="flex items-center gap-x-2 mb-6">
              <UserAvatar src={profile.imageUrl} />
              <div className="flex flex-col gap-y-1">
                <div className="text-xs font-semibold flex items-center gap-x-1">
                  {profile.name}
                  {roleIconMap[role]}
                </div>
                <p className="text-xs text-zinc-500">{profile.email}</p>
              </div>
              {server.profileId !== profileId && LoadingId !== id && (
                <div className="ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Icon
                        name="more-vertical"
                        className="h-4 w-4 text-zinc-500"
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="left">
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="flex items-center">
                          <QuestionMarkCircledIcon className="w-4 h-4 mr-2" />
                          <span>Role</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem
                              onClick={async () =>
                                await changeMemberRole(
                                  id,
                                  "GUEST",
                                  setLoadingId,
                                  server.id,
                                  Router,
                                  onOpen,
                                )
                              }
                            >
                              <PersonIcon className="h-4 w-4 mr-2" />
                              Guest
                              {role === "GUEST" && (
                                <Icon
                                  name="check"
                                  className="h-4 w-4 ml-auto"
                                />
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={async () =>
                                await changeMemberRole(
                                  id,
                                  "MODERATOR",
                                  setLoadingId,
                                  server.id,
                                  Router,
                                  onOpen,
                                )
                              }
                            >
                              <BackpackIcon className="h-4 w-4 mr-2" />
                              Moderator
                              {role === "MODERATOR" && (
                                <Icon
                                  name="check"
                                  className="h-4 w-4 ml-auto"
                                />
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={async () =>
                          await deleteUserFromServer(
                            id,
                            setLoadingId,
                            server.id,
                            Router,
                            onOpen,
                          )
                        }
                      >
                        <ExitIcon className="h-4 w-4 mr-2" />
                        Kick
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              {LoadingId === id && (
                <Icon
                  name="loader-2"
                  className="animate-spin text-zinc-500 ml-auto w-4 h-4"
                />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MembersModal;
