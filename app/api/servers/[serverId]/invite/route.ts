import currentProfile from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 } from "uuid";

const PATCH = async (
  req: Request,
  { params }: { params: { serverId: string } },
) => {
  try {
    const profile = await currentProfile();

    if (!profile) return new NextResponse("unAuthorized", { status: 402 });

    if (!params.serverId)
      return new NextResponse("Missing server Id ¯_(ツ)_/¯", { status: 400 });

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: v4(),
      },
    });

    return  NextResponse.json(server)
  } catch (error) {
    console.log(`Error while creating new invite link --> ${error}`);
  }
};

export { PATCH };
