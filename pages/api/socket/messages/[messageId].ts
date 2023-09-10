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
      { messageId, serverId, channelId } = req.query;

    if (!profile) return res.status(401).json({ error: "Unauthorized" });
    if (!serverId)
      return res.status(400).json({ error: "server is not valid" });
    if (!messageId) return res.status(401).json({ error: "invalid req" });
    if (!channelId)
      return res.status(400).json({ error: "channel is not valid" });
    if (req.method === "PATCH" && !content)
      return res.status(400).json({ error: "empty message can't be updated" });

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        Members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        Members: true,
      },
    });
    if (!server) return res.status(404).json({ error: "server not found" });

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });

    if (!channel) return res.status(400).json({ error: "channel not found" });

    const member = server.Members.find(
      ({ profileId }) => profileId === profile.id,
    );
    if (!member)
      return res.status(400).json({ error: "member is a part of this server" });

    let message = await db.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
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
    if (!canModify)
      return res
        .status(400)
        .json({ error: "only admin and owner can edit this message" });

    if (req.method === "DELETE") {
      message = await db.message.update({
        where: {
          id: messageId as string,
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
      message = await db.message.update({
        where: {
          id: messageId as string,
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
    const updateKey: string = `chat:${channelId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
};

export default handler;
