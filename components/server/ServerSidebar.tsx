import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import currentProfile from "@/lib/currentProfile";
import ServerHeader from "@/components/server/ServerHeader";
import ServerSearch from "@/components/server/ServerSearch";
import Icon from "@/components/Icon";
import ServerCollectionSection from "./ServerCollectionSection";

const iconMap = {
  [ChannelType.TEXT]: <Icon name="hash" className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Icon name="mic-2" className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Icon name="video" className="mr-2 h-4 w-4" />,
};

const roleMap = {
  [MemberRole.GUEST]: (
    <Icon name="user-2" className="h-4 w-4 mr-2 text-zinc-400 " />
  ),
  [MemberRole.MODERATOR]: (
    <Icon name="shield-ellipsis" className="h-4 w-4 mr-2 text-indigo-400" />
  ),
  [MemberRole.ADMIN]: (
    <Icon name="shield" className="h-4 w-4 mr-2 text-rose-400 " />
  ),
};

const ServerSidebar = async ({ serverId }: { serverId: string }) => {
  const profile = await currentProfile();
  if (!profile) redirect("/");

  const server = await db.server.findUnique({
      where: {
        id: serverId,
      },
      include: {
        Channels: {
          orderBy: {
            createdAt: "asc",
          },
        },
        Members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    }),
    // Channels from the server
    textChannels = server?.Channels.filter(
      ({ type }) => type === ChannelType.TEXT,
    ), // text channel
    audioChannel = server?.Channels.filter(
      ({ type }) => type === ChannelType.AUDIO,
    ), // audio channel
    videoChannel = server?.Channels.filter(
      ({ type }) => type === ChannelType.VIDEO,
    ), // video channel
    // All Members from the filtered server
    memeber = server?.Members.filter(
      ({ profileId }) => profileId !== profile?.id,
    ),
    // current user's role
    role = server?.Members.find(
      ({ profileId }) => profileId === profile?.id,
    )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text channels",
                type: "channel",
                data: textChannels?.map((channel) => {
                  return {
                    id: channel.id,
                    name: channel.name,
                    icon: iconMap[channel.type],
                  };
                }),
              },
              {
                label: "Audio channels",
                type: "channel",
                data: audioChannel?.map((channel) => {
                  return {
                    id: channel.id,
                    name: channel.name,
                    icon: iconMap[channel.type],
                  };
                }),
              },
              {
                label: "Video channels",
                type: "channel",
                data: videoChannel?.map((channel) => {
                  return {
                    id: channel.id,
                    name: channel.name,
                    icon: iconMap[channel.type],
                  };
                }),
              },
              {
                label: "Members",
                type: "member",
                data: memeber?.map((member) => {
                  return {
                    id: member.id,
                    name: member.profile.name,
                    icon: roleMap[member.role],
                  };
                }),
              },
            ]}
          />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerCollectionSection
              channelType={"TEXT"}
              role={role}
              sectionType="channel"
              label="channel"
              server={server}
            />
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
