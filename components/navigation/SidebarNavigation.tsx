import currentProfile from "@/lib/currentProfile";
import SidebarNavigationAction from "@/components/navigation/SidebarNavigationAction";
import SidebarNavigationItems from "@/components/navigation/SidebarNavigationItems";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const SidebarNavigation = async () => {
  const profile = await currentProfile();

  if (!profile) redirect("/");

  const server = await db.server.findMany({
    where: {
      Members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1e1f22] py-3">
      <SidebarNavigationAction />
      <Separator
        className={
          "h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto"
        }
      />
      <ScrollArea className="flex-1 w-full">
        {server.map(({ name, imageUrl, id }) => {
          return (
            <SidebarNavigationItems
              imageUrl={imageUrl}
              id={id}
              name={name}
              key={id}
            />
          );
        })}
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <ThemeToggle />

        <UserButton
          afterSignOutUrl="/"
          appearance={{
            userProfile: {
              baseTheme: dark, // this is hard coded :(
            },
            baseTheme: dark, // this is hard coded :(
            elements: {
              avatarBox: "h-[48px] w-[48px]",
            },
          }}
        />
      </div>
    </div>
  );
};

export default SidebarNavigation;
