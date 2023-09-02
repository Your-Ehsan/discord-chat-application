import currentProfile from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const PATCH = async (
  req: Request,
  { params }: { params: { serverId: string } },
) => {
  try {
    const { serverId }: { serverId: string } = await req.json();
    const profile = await currentProfile();

    if (!profile) return new NextResponse("unAuthorized", { status: 402 });

    if (params.serverId !== serverId)
      return new NextResponse("invald server id", { status: 402 });

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: {
          not: profile.id,
        },
        Members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        Members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });

    return NextResponse.json(server); // expected responce
  } catch (error) {
    const _error = `Error while processing [SERVER_LEAVE] request because of --> ${error}`;
    console.log(_error);
    return new NextResponse(_error, { status: 500 });
  }
};

export { PATCH };
