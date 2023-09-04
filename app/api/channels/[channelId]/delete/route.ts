import currentProfile from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const DELETE = async (
  req: Request,
  { params }: { params: { channelId: string } },
) => {
  try {
    const profile = await currentProfile(),
      { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    if (!profile) return new NextResponse("Unauthorized", { status: 400 });
    if (!serverId) return new NextResponse("Server not found", { status: 400 });
    if (!params.channelId)
      return new NextResponse("channel not found", { status: 400 });

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
          delete: {
            id: params.channelId,
            name: {
              not: "general",
            },
          },
        },
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    const _error = `Error while deleting channel --> ${error}`;
    console.log(_error);
    return new NextResponse(_error, { status: 500 });
  }
};

export { DELETE };
