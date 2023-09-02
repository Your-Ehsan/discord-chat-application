import currentProfile from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const DELETE = async (
  req: Request,
  { params }: { params: { serverId: string } },
) => {
  try {
    const profile = await currentProfile();

    if (!profile) return new NextResponse("unAuthorized", { status: 402 });

    if (!params.serverId)
      return new NextResponse("invald server id", { status: 402 });

    const server = await db.server.delete({
      where: {
        id: params.serverId,
        profileId: profile.id,
        Members: {
          some: {
            profileId: profile.id,
          },
        },
      },
    });

    return NextResponse.json(server); // expected responce
  } catch (error) {
    const _error = `Error while processing [SERVER_DELETE] request because of --> ${error}`;
    console.log(_error);
    return new NextResponse(_error, { status: 500 });
  }
};

export { DELETE };
