"use client";
import { MessageWithMember_Profile, chatParamKey, chatType } from "@/lib/types";
import { Member } from "@prisma/client";
import ChatWelcome from "./ChatWelcome";
import { useReactQuery } from "@/hooks/useReactQuery";
import { Loader2, ServerCrashIcon } from "lucide-react";
import { Fragment } from "react";
import ChatMessage from "./ChatMessage";
import { format } from "date-fns";

type ChatMessagesType = {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: chatParamKey;
  paramValue: string;
  type: chatType;
};

const ChatMessages = ({
  apiUrl,
  chatId,
  member,
  name,
  paramKey,
  paramValue,
  socketQuery,
  socketUrl,
  type,
}: ChatMessagesType) => {
  const queryKey: string = `chat:${chatId}`,
    DATE_FORMAT: string = "d MMM yyyy, HH:mm",
    { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
      useReactQuery({
        apiUrl: apiUrl,
        paramKey: paramKey,
        paramValue: paramValue,
        queryKey: queryKey,
      });

  if (status === "loading")
    return (
      <div className="flex flex-col flex-1 justify-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          Loading Chat ...
        </span>
      </div>
    );

  if (status === "error")
    return (
      <div className="flex flex-col flex-1 justify-center">
        <ServerCrashIcon className="h-7 w-7 text-zinc-500 animate-pulse my-4" />
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          something sent wrong!
        </span>
      </div>
    );

  return (
    <>
      <div className="flex-1 flex flex-col py-4 overflow-y-auto ">
        <div className="flex-1">
          <ChatWelcome name={name} type={type} />
          <div className="flex flex-col-reverse mt-auto">
            {data?.pages?.map((group, index) => (
              <Fragment key={index}>
                {group?.items?.map((msg: MessageWithMember_Profile) => (
                  <div key={msg.id}>
                    <ChatMessage
                      id={msg.id}
                      content={msg.content}
                      currentMember={member}
                      deleted={msg.deleted}
                      fileUrl={msg.fileUrl}
                      isUpdated={msg.createdAt !== msg.updatedAt}
                      member={msg.member}
                      socketQuery={socketQuery}
                      socketUrl={socketUrl}
                      timeStamp={format(new Date(msg.createdAt), DATE_FORMAT)}
                    />
                  </div>
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatMessages;
