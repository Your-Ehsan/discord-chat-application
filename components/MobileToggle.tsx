import { MenuIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import SidebarNavigation from "@/components/navigation/sidebar/SidebarNavigation";
import ServerSidebar from "@/components/server/ServerSidebar";

type MobileToggleProps = {
  serverId: string;
};

const MobileToggle = ({ serverId }: MobileToggleProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild={true}>
        <Button variant={"ghost"} size={"icon"} className="md:hidden">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent closeIcon={false} side={"left"} className="p-0 flex gap-0">
        <div className="w-[72px]">
          <SidebarNavigation />
        </div>
        <ServerSidebar serverId={serverId} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileToggle;
