import currentProfile from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { ChannelType } from "@prisma/client";
import { NextResponse } from "next/server";

const PATCH = async (
  req: Request,
  { params }: { params: { channelId: string } },
) => {
  try {
    const profile = await currentProfile(),
      { name, type }: { name: string; type: string } = await req.json(),
      { searchParams } = new URL(req.url),
      serverId = searchParams.get("serverId");

    if (!profile) return new NextResponse("Unauthorized", { status: 402 });
    if (!params.channelId)
      return new NextResponse("invalid channel", { status: 402 });
    if (!serverId) return new NextResponse("server not found", { status: 402 });
    if (name === "general")
      return new NextResponse("invalid credentials", { status: 401 });
    if (type !== "TEXT" && type !== "AUDIO" && type !== "VIDEO") {
      return new NextResponse("invalid credentials", { status: 401 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        Members: {
          some: {
            profileId: profile.id,
            role: {
              in: ["ADMIN", "MODERATOR"],
            },
          },
        },
      },
      data: {
        Channels: {
          update: {
            where: {
              id: params.channelId,
              NOT: {
                name: "general",
              },
            },
            data: {
              name: name,
              type: type,
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    const _error = `Error while updating channel --> ${error}`;
    console.log(_error);
    return new NextResponse(_error, { status: 500 });
  }
};

export { PATCH };
