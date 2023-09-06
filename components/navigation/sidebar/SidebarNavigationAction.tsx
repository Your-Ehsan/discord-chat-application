"use client";

import { PlusIcon } from "@radix-ui/react-icons";
import ActionTooltip from "../../tooltips/ActionTooltip";
import { useModalStore } from "@/hooks/useModalStore";

const SidebarNavigationAction = () => {
  const { onOpen } = useModalStore();
  return (
    <div>
      <ActionTooltip label="Add a server" align="center" side="right">
        <button
          onClick={() => onOpen("createServer")}
          className="group flex items-center"
        >
          <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
            <PlusIcon
              className="group-hover:text-white transition text-emerald-500"
              fontSize={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};

export default SidebarNavigationAction;
