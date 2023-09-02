import currentProfile from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { serverModalformValuesTypes } from "@/lib/types";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { v4 } from "uuid";

const POST = async (req: Request) => {
  try {
    const profile = await currentProfile(),
      { name, imageUrl }: serverModalformValuesTypes = await req.json();

    if (!profile) return new NextResponse("Unauthorized", { status: 402 });

    const server = await db.server.create({
      data: {
        imageUrl: imageUrl,
        name: name,
        inviteCode: v4(),
        profileId: profile.id,
        Channels: {
          create: [
            {
              name: "general",
              profileId: profile.id,
            },
          ],
        },
        Members: {
          create: [
            {
              profileId: profile.id,
              role: MemberRole.ADMIN,
            },
          ],
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log(`Errror while creating server on api Request --> ${error}`);
    return new NextResponse("internal server error", { status: 500 });
  }
};

export { POST };
