import ServerSidebar from "@/components/server/ServerSidebar";
import currentProfile from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

const serverIdLayout = async ({
  children,
  params,
}: {
  params: { serverId: string };
  children: ReactNode;
}) => {
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      Members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) redirect("/");
  return (
    <section className="h-full">
      <div className="hidden md:flex fixed h-full w-60 z-20 flex-col inset-y-0">
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </section>
  );
};

export default serverIdLayout;
