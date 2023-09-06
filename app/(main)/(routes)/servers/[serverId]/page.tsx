import currentProfile from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const ServerPage = async ({ params }: { params: { serverId: string } }) => {
  const profile = await currentProfile();
  if (!profile)
    return redirectToSignIn({ returnBackUrl: `/servers/${params.serverId}` });

  const server = await db.server.findUnique({
      where: {
        id: params.serverId,
        Members: {
          some: {
            profile: {
              userId: profile.userId,
            },
            role: {
              in: ["ADMIN", "GUEST", "MODERATOR"],
            },
          },
        },
      },
      include: {
        Channels: {
          where: {
            name: "general",
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    }),
    initialChannel = server?.Channels[0];

  if (initialChannel?.name !== "general") return null;
  return redirect(`/servers/${params.serverId}/channels/${initialChannel.id}`);
};

export default ServerPage;
