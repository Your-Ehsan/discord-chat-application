import currentProfile from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
import ServerHeader from "./ServerHeader";

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
    </div>
  );
};

export default ServerSidebar;
