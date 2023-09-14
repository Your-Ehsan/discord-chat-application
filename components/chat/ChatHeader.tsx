import { chatType } from "@/lib/types";
import { Hash } from "lucide-react";
import MobileToggle from "../MobileToggle";
import UserAvatar from "../UserAvatar";
import SocketIndicator from "../SocketIndicator";
import ChatVideoBtn from "./ChatVideoBtn";

type ChatHeaderProps = {
  serverId: string;
  name: string;
  type: chatType;
  imageUrl?: string | undefined;
};

const ChatHeader = ({ name, serverId, type, imageUrl }: ChatHeaderProps) => {
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 shadow transition-all">
      <MobileToggle serverId={serverId} />
      {type === "channel" && (
        <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2 " />
      )}
      {imageUrl && type === "chat" && (
        <UserAvatar src={imageUrl} className="h-6 w-6 md:h-8 md:w-8 mr-2" />
      )}
      <span className="font-semibold text-md text-zinc-700 dark:text-zinc-300 ">
        {name}
      </span>
      <div className="ml-auto flex items-center">
        {type === "chat" && <ChatVideoBtn />}
        <SocketIndicator />
      </div>
    </div>
  );
};

export default ChatHeader;
