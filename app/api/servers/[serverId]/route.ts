import currentProfile from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { serverModalformValuesTypes } from "@/lib/types";
import { NextResponse } from "next/server";

const PATCH = async (
  req: Request,
  { params }: { params: { serverId: string } },
) => {
  try {
    const profile = await currentProfile(),
      { imageUrl, name }: serverModalformValuesTypes = await req.json();

    if (!profile) return new NextResponse("unAuthorized", { status: 402 });

    if (!params.serverId)
      return new NextResponse("Missing server Id ¯_(ツ)_/¯", { status: 400 });

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        name: name,
        imageUrl: imageUrl,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log(`Error while updating new server --> ${error}`);
  }
};

export { PATCH };
