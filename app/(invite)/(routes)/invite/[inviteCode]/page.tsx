import currentProfile from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const page = async ({ params }: { params: { inviteCode: string } }) => {
  const profile = await currentProfile();

  if (!profile) return redirectToSignIn();
  if (!params.inviteCode) return redirect("/");

  const isServerExist = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      Members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  if (isServerExist) return redirect(`/servers/${isServerExist.id}`);

  const server = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      Members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });
  return <div>page</div>;
};

export default page;
