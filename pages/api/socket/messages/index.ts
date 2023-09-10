import currentProfileInPages from "@/lib/currentProfileInPages";
import { db } from "@/lib/db";
import { ChatInputSchemaType, NextApiResponseSocketServer } from "@/lib/types";
import { NextApiRequest } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponseSocketServer,
) => {
  try {
    if (req.method !== "POST")
      return res.status(405).json({ error: "method is not allowed" });

    const profile = await currentProfileInPages(req),
      { content, fileUrl } = req.body,
      { serverId, channelId } = req.query;

    if (!profile) return res.status(401).json({ error: "Unauthorized" });
    if (!serverId) return res.status(400).json({ error: "invalid server ID" });
    if (!channelId)
      return res.status(400).json({ error: "invalid channel ID" });
    if (!content)
      return res.status(400).json({ error: "content should not be empty" });

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        Members: {
          some: {
            profileId: profile.id as string,
          },
        },
      },
      include: {
        Members: true,
      },
    });
    if (!server) return res.status(404).json({ message: "server not found" });

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });
    if (!channel) return res.status(404).json({ message: "channel not found" });

    const member = server.Members.find(
      ({ profileId }) => profileId === profile.id,
    );
    if (!member)
      return res
        .status(404)
        .json({ message: "member is not a part of this server" });

    const message = await db.message.create({
      data: {
        content: content as string,
        fileUrl: fileUrl as string,
        channelId: channelId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey: string = `chat:${channelId}:messages`;
    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ messsage: `internal server error --> ${error}` });
  }
};

export default handler;
