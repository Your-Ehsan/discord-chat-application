import MediaRoom from "@/components/MediaRoom";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import currentProfile from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const page = async ({
  params,
}: {
  params: { channelId: string; serverId: string };
}) => {
  const profile = await currentProfile();

  if (!profile)
    return redirectToSignIn({
      returnBackUrl: `/servers/${params.serverId}/channels/${params.channelId}`,
    });

  const channel = await db.channel.findUnique({
      where: {
        id: params.channelId,
      },
    }),
    member = await db.member.findFirst({
      where: {
        profileId: profile.id,
        serverId: params.serverId,
        role: {
          in: ["ADMIN", "GUEST", "MODERATOR"],
        },
      },
    });

  if (!channel) return redirect(`/`);
  if (!member) return redirect(`/`);

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        serverId={channel.serverId}
        type="channel"
        name={channel.name}
      />
      {channel.type === "TEXT" && (
        <>
          <ChatMessages
            apiUrl="/api/messages"
            name={channel.name}
            type="channel"
            chatId={channel.id}
            member={member}
            paramKey="channelId"
            paramValue={channel.id}
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            socketUrl="/api/socket/messages"
          />
          <ChatInput
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
          />
        </>
      )}
      {channel.type === "AUDIO" && (
        <MediaRoom audio={true} chatId={channel.id} video={false} />
      )}
      {channel.type === "VIDEO" && (
        <MediaRoom audio={true} chatId={channel.id} video={true} />
      )}
    </div>
  );
};
// /api/socket/io
export default page;
