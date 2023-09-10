import { Member, MemberRole, Profile } from "@prisma/client";
import UserAvatar from "../UserAvatar";
import ActionTooltip from "../tooltips/ActionTooltip";
import {
  EditIcon,
  FileIcon,
  ShieldAlert,
  ShieldCheck,
  TrashIcon,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChatInputSchema } from "@/lib/schemas";
import { ChatInputSchemaType } from "@/lib/types";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import queryString from "query-string";
import { useModalStore } from "@/hooks/useModalStore";
import { useParams } from "next/navigation";
import Link from "next/link";

type ChatMessageProp = {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timeStamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
};

const roleIcons = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-rose-400" />,
};

const ChatMessage = ({
  content,
  currentMember,
  deleted,
  fileUrl,
  id,
  isUpdated,
  member,
  socketQuery,
  socketUrl,
  timeStamp,
}: ChatMessageProp) => {
  const [Edit, setEdit] = useState<boolean>(false),
    [Delete, setDelete] = useState<boolean>(false),
    param = useParams();

  const fileType = fileUrl?.split(".").pop();

  const isAdmin = currentMember.role === MemberRole.ADMIN,
    isModerator = currentMember.role === MemberRole.MODERATOR,
    isOwner = currentMember.id === member.id;

  const canDeleteMessage = !deleted && isAdmin || isModerator || isOwner,
    canEditMesage = !deleted && isOwner && !fileUrl;

  const isPdf = fileType === "pdf" && fileUrl,
    isImg = !isPdf && fileUrl;

  const form = useForm<ChatInputSchemaType>({
      //@ts-ignore
      resolver: zodResolver(ChatInputSchema),
      defaultValues: {
        content: content,
      },
    }),
    isLoading: boolean = form.formState.isLoading;

  useEffect(() => {
    form.reset({
      content: content,
    });
  }, [content, form]);

  useEffect(() => {
    const handleKeyEscapeOnEdit = (e: any) => {
      if (e.key === "Escape" || e.keyCode === 27) {
        setEdit(false);
      }
    };
    window.addEventListener("keydown", handleKeyEscapeOnEdit);
    return () => window.removeEventListener("keydown", handleKeyEscapeOnEdit);
  }, []);

  const { onOpen } = useModalStore();

  const onSubmit = async ({ content }: ChatInputSchemaType) => {
    try {
      await axios
        .patch(
          queryString.stringifyUrl({
            url: `${socketUrl}/${id}`,
            query: socketQuery,
          }),
          { content: content },
        )
        .then(() => {
          form.reset();
          setEdit(false);
        });
    } catch (error) {
      console.log("getting error while updating message because --> %d", error);
    }
  };

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition-all w-full ">
      <div className="group flex gap-x-2 items-center w-full">
        <div className="cursor-pointer hover:drop-shadow-md transition-all ">
          <UserAvatar src={member?.profile?.imageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <Link
                href={
                  member.id !== currentMember.id
                    ? `/servers/${param?.serverId}/chats/${member.id}`
                    : ""
                }
              ></Link>
              <span className="font-semibold text-sm hover:underline cursor-pointer transition-all">
                {member.profile.name}
              </span>
              <ActionTooltip label={member.role}>
                {roleIcons[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-300">
              {timeStamp}
            </span>
          </div>
          {isImg && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferer"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center  bg-secondary h-48 w-48 "
            >
              <Image
                src={fileUrl}
                alt={content}
                fill
                className="object-center"
              />
            </a>
          )}
          {isPdf && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                Pdf file
              </a>
            </div>
          )}
          {!fileUrl && !Edit && (
            <span
              className={cn(
                "text-sm text-zinc-600 dark:text-zinc-300 ",
                deleted &&
                  "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1",
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </span>
          )}
          {!fileUrl && Edit && (
            <Form {...form}>
              <form
                className="flex items-center w-full ga-x-2 pt-2"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name={"content"}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            disabled={isLoading}
                            {...field}
                            className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                            placeholder="edit message"
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button size={"sm"} variant={"primary"} disabled={isLoading}>
                  save
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">
                Press escape to cancel, enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {!deleted && canDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm ">
          {canEditMesage && (
            <ActionTooltip label="Edit">
              <EditIcon
                onClick={() => setEdit(true)}
                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-all "
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <TrashIcon
              onClick={() =>
                onOpen("deleteMessage", {
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery,
                })
              }
              className="cursor-pointer ml-auto w-4 h-4 text-rose-400 hover:text-rose-500 transition-all "
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
