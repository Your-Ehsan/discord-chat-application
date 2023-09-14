import {
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
