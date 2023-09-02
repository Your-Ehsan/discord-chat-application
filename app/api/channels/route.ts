import currentProfile from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

const POST = async (req: Request) => {
  try {
    const profile = await currentProfile(),
      { name, type } = await req.json(),
      { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    if (!profile) return new NextResponse("Unauthorized", { status: 402 });

    if (!serverId)
      return new NextResponse("Error getting server !", { status: 400 });

    if (name === "general")
      return new NextResponse("name cannot be general", { status: 400 });

    const server = await db.server.update({
      where: {
        id: serverId,
        Members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        Channels: {
          create: {
            profileId: profile.id,
            type: type,
            name: name,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log(`Error while creating channel --> ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export { POST };
