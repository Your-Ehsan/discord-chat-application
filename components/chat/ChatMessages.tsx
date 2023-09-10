"use client";

import { MessageWithMember_Profile, chatParamKey, chatType } from "@/lib/types";
import { Member } from "@prisma/client";
import ChatWelcome from "./ChatWelcome";
import { useReactQuery } from "@/hooks/useReactQuery";
import { Loader2, Loader2Icon, ServerCrashIcon } from "lucide-react";
import { ElementRef, Fragment, useRef } from "react";
import ChatMessage from "./ChatMessage";
import { format } from "date-fns";
import { useChatSocket } from "@/hooks/useChatSocket";
import { Button } from "../ui/button";
import { useChatScroll } from "@/hooks/useChatScroll";

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
    addKey: string = `chat:${chatId}:messages`,
    updateKey: string = `chat:${chatId}:messages:update`,
    chatRef = useRef<ElementRef<"div">>(null),
    bottomRef = useRef<ElementRef<"div">>(null),
    DATE_FORMAT: string = "d MMM yyyy, HH:mm",
    { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
      useReactQuery({
        apiUrl: apiUrl,
        paramKey: paramKey,
        paramValue: paramValue,
        queryKey: queryKey,
      });

  useChatSocket({
    queryKey: queryKey,
    addKey: addKey,
    updateKey: updateKey,
  });

  useChatScroll({
    bottomRef: bottomRef,
    chatRef: chatRef,
    // count: data?.pages[0]?.items?.length ?? 0,
    count: data?.pages?.[0]?.items?.length ?? 0,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
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
      <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto ">
        {!hasNextPage && <div className="flex-1" />}
        {!hasNextPage && <ChatWelcome name={name} type={type} />}
        {hasNextPage && (
          <div className="flex justify-center">
            {isFetchingNextPage ? (
              <Loader2Icon className="h-6 w-6 text-zinc-500 animate-spin my-4" />
            ) : (
              <Button
                size={"sm"}
                variant={"ghost"}
                className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition-all"
                onClick={() => fetchNextPage()}
              >
                Previous messages
              </Button>
            )}
          </div>
        )}
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
        {/* </div> */}
        <div ref={bottomRef} />
      </div>
    </>
  );
};

export default ChatMessages;
