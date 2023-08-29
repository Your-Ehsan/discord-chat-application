import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initialProfile";
import { redirect } from "next/navigation";

const page = async () => {
  const profile: {
    id: string;
    userId: string;
    name: string;
    imageUrl: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  } | null = await initialProfile();
  
  const server = await db.server.findFirst({
    where: {
      Members: {
        some: {
          profileId: profile?.id,
        },
      },
    },
  });

  if(server){
    return redirect(`/servers/${server.id}`)
  }
  return <div>page</div>;
};

export default page;
