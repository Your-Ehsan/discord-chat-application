import currentProfileInPages from "@/lib/currentProfileInPages";
import { db } from "@/lib/db";
import { ChatInputSchemaType, NextApiResponseSocketServer } from "@/lib/types";
import { NextApiRequest } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponseSocketServer,
) => {
  if (req.method !== "DELETE" && req.method !== "PATCH")
    return res.status(405).json({ error: "Method is not allowed" });

  try {
    const profile = await currentProfileInPages(req);

    const { content }: ChatInputSchemaType = req.body,
      { directMessageId, conversationId } = req.query;

    if (!profile) return res.status(401).json({ error: "Unauthorized" });
    if (!directMessageId)
      return res.status(400).json({ error: "message request is not valid" });
    if (!conversationId) return res.status(401).json({ error: "invalid req" });
    // if (!channelId)
    //   return res.status(400).json({ error: "channel is not valid" });
    if (req.method === "PATCH" && !content)
      return res.status(400).json({ error: "empty message can't be updated" });

    const conversation = await db.chat.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!conversation)
      return res.status(401).json({ error: "invalid conversation request" });

    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member)
      return res
        .status(400)
        .json({ error: "member is a not a part of this system" });

    let message = await db.directChat.findFirst({
      where: {
        id: directMessageId as string,
        chatId: conversationId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!message) return res.status(404).json({ error: "message not found" });

    const isMessageOwner = message.memberId === member.id,
      isAdmin = member.role === "ADMIN",
      isModerator = member.role === "MODERATOR",
      canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) return res.status(400).json({ error: "Unauthorized" });

    if (req.method === "DELETE") {
      message = await db.directChat.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          fileUrl: null,
          content: "This message has been deleted",
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }
    if (req.method === "PATCH") {
      if (!isMessageOwner)
        return res
          .status(401)
          .json({ error: "only owner can update thier message" });
      message = await db.directChat.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          content: content as string,
          deleted: false,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    const updateKey: string = `chat:${conversation.id}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
};

export default handler;
