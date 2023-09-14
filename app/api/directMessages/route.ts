import currentProfile from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { DirectChat } from "@prisma/client";
import { NextResponse } from "next/server";

const GET = async (req: Request) => {
  try {
    const profile = await currentProfile(),
      { searchParams } = new URL(req.url),
      cursor = searchParams.get("cursor"),
      conversationId = searchParams.get("chatId");

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });
    if (!conversationId)
      return new NextResponse("channel is not valid", { status: 400 });

    let messages: DirectChat[] = [];

    if (cursor) {
      messages = await db.directChat.findMany({
        take: 20,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          chatId: conversationId as string,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await db.directChat.findMany({
        take: 20,
        where: {
          chatId: conversationId as string,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;
    if (messages.length === 20) nextCursor = messages[20 - 1].id;

    return NextResponse.json({
      items: messages,
      nextCursor: nextCursor,
    });
    
  } catch (error) {
    const _error: string = `Getting error while fetching the messages ${error}`;
    console.log(_error);
    return new NextResponse(_error, { status: 500 });
  }
};

export { GET };
