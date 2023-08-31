"use client";
import { cn } from "@/lib/utils";
import ActionTooltip from "../tooltips/ActionTooltip";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

const SidebarNavigationItems = ({
  name,
  imageUrl,
  id,
}: {
  name: string;
  imageUrl: string;
  id: string;
}) => {
  const Params = useParams(),
    Router = useRouter();
  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button
        onClick={() => Router.push(`/servers/${id}`)}
        className="group relative flex items-center my-3"
      >
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            Params?.serverId !== id && "group-hover:h-[20px]",
            Params?.serverId === id ? "h-[36px]" : "h-[8px]",
          )}
        />
        <div
          className={cn(
            "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
            Params?.serverId === id &&
              "bg-primary/10 text-primary rounded-[16px]",
          )}
        >
          <Image
            fill
            src={imageUrl}
            alt={name}
            sizes="(max-width: 768px) 90px, (max-width: 1200px) 180px, 250px"
          />
        </div>
      </button>
    </ActionTooltip>
  );
};

export default SidebarNavigationItems;
