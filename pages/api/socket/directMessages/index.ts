import currentProfileInPages from "@/lib/currentProfileInPages";
import { db } from "@/lib/db";
import { NextApiResponseSocketServer } from "@/lib/types";
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
      { conversationId } = req.query;

    if (!profile) return res.status(401).json({ error: "Unauthorized" });

    if (!conversationId)
      return res.status(400).json({ error: "invalid channel ID" });
    if (!content)
      return res.status(400).json({ error: "content should not be empty" });

    const chat = await db.chat.findFirst({
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

    if (!chat)
      return res.status(404).json({ error: "conversation can't exist" });

    const member =
      chat.memberOne.profileId === profile.id ? chat.memberOne : chat.memberTwo;

    if (!member) return res.status(404).json({ error: "member is not exist" });

    const message = await db.directChat.create({
      data: {
        content: content as string,
        fileUrl: fileUrl as string,
        chatId: conversationId as string,
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

    const channelKey: string = `chat:${conversationId}:messages`;
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
