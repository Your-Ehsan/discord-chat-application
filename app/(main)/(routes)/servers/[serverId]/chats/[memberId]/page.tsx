import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import { getORcreateChat } from "@/lib/chat";
import currentProfile from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const page = async ({
  params,
}: {
  params: { memberId: string; serverId: string };
}) => {
  const profile = await currentProfile();

  if (!profile)
    return await redirectToSignIn({
      returnBackUrl: `/servers/${params.serverId}/chats/${params.memberId}`,
    });

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      role: {
        in: ["ADMIN", "GUEST", "MODERATOR"],
      },
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) return redirect("/");

  const conversation = await getORcreateChat(currentMember.id, params.memberId);

  if (!conversation) return redirect(`/servers/${params.serverId}`);

  const { memberOne, memberTwo } = conversation;

  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;
  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        name={otherMember.profile.name}
        type="chat"
        serverId={params.serverId}
        imageUrl={otherMember.profile.imageUrl}
      />
      <ChatMessages
        name={otherMember.profile.name}
        type="chat"
        apiUrl="/api/directMessages"
        chatId={conversation.id}
        member={currentMember}
        paramKey="chatId"
        paramValue={conversation.id}
        socketQuery={{
          conversationId: conversation.id,
        }}
        socketUrl="/api/socket/directMessages"
      />
      <ChatInput
        apiUrl="/api/socket/directMessages"
        name={otherMember.profile.name}
        type="chat"
        query={{
          conversationId: conversation.id,
        }}
      />
    </div>
  );
};

export default page;
