import { AccessToken } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const room = req.nextUrl.searchParams.get("room");
  const username = req.nextUrl.searchParams.get("username");
  if (!room) {
    return NextResponse.json(
      { error: 'Missing "room" query parameter' },
      { status: 400 },
    );
  } else if (!username) {
    return NextResponse.json(
      { error: 'Missing "username" query parameter' },
      { status: 400 },
    );
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (!apiKey || !apiSecret || !wsUrl) {
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 },
    );
  }

  const at = new AccessToken(apiKey, apiSecret, { identity: username });

  at.addGrant({ room, roomJoin: true, canPublish: true, canSubscribe: true });

  return NextResponse.json({ token: at.toJwt() });
}

/**
 * import {
  livekit_API,
  livekit_API_Secret,
  livekit_url,
} from "@/lib/env/liveKit";
import { AccessToken } from "livekit-server-sdk";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const room = req.query.room as string;
  const username = req.query.username as string;
  
  if (req.method !== "GET") {
    return res.status(400).json({ error: "Invalid method" });
  } else if (!room) {
    return res.status(400).json({ error: 'Missing "room" query parameter' });
  } else if (!username) {
    return res
      .status(400)
      .json({ error: 'Missing "username" query parameter' });
  }

  if (!livekit_API || !livekit_API_Secret || !livekit_url)
    return res.status(500).json({ error: "Server misconfigured" });

  const at = new AccessToken(livekit_API, livekit_API_Secret, {
    identity: username,
  });

  at.addGrant({ room, roomJoin: true, canPublish: true, canSubscribe: true });
  res.status(200).json({ token: at.toJwt() });
}

 */
