import currentProfile from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const PATCH = async (
  req: Request,
  { params }: { params: { memberId: string } },
) => {
  try {
    const profile = await currentProfile(),
      { searchParams } = new URL(req.url),
      { role } = await req.json();

    const serverId = searchParams.get("serverId"),
      memberId = searchParams.get("memberId");

    if (!profile) return new NextResponse("Unauthorized", { status: 402 });

    if (!serverId)
      return new NextResponse("server ID is not correct", { status: 400 });

    if (params.memberId !== memberId)
      return new NextResponse("Member is not valid", { status: 400 });

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        Members: {
          update: {
            where: {
              id: params.memberId,
              serverId: serverId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role: role,
            },
          },
        },
      },
      include: {
        Members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log(`Error updating member role ＞︿＜ --> ${error}`);
    return new NextResponse("internal server error", { status: 500 });
  }
};

const DELETE = async (
  req: Request,
  { params }: { params: { memberId: string } },
) => {
  try {
    const profile = await currentProfile(),
      { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    if (!profile) return new NextResponse("Unauthorized", { status: 402 });

    if (!serverId)
      return new NextResponse("server ID is not correct", { status: 400 });

    if (!params.memberId)
      return new NextResponse("Member is not valid", { status: 400 });

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        Members: {
          deleteMany: {
            id: params.memberId,
            profileId: {
              not: profile.id,
            },
          },
        },
      },
      include: {
        Members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log(`Error Deleting member ＞﹏＜ --> ${error}`);
    return new NextResponse("internal server error", { status: 500 });
  }
};
export { PATCH, DELETE };
