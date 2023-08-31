import InitialCreateServerModal from "@/components/modals/InitialCreateServerModal";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initialProfile";
import { DBprofile } from "@/lib/types";
import { redirect } from "next/navigation";

const page = async () => {
  const profile: DBprofile = await initialProfile();

  const server = await db.server.findFirst({
    where: {
      Members: {
        some: {
          profileId: profile?.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }
  return <InitialCreateServerModal/>
};

export default page;
