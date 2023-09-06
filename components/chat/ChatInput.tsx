"use client";

import qs from "query-string";
import { ChatInputSchemaType, chatType } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { ChatInputSchema } from "@/lib/schemas";
import { PlusIcon, SmileIcon } from "lucide-react";
import axios from "axios";
import { useModalStore } from "@/hooks/useModalStore";
import EmojiPicker from "./EmojiPicker";
import { useRouter } from "next/navigation";

type ChatInputType = {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: chatType;
};

const ChatInput = ({ apiUrl, name, query, type }: ChatInputType) => {
  const form = useForm<ChatInputSchemaType>({
      //@ts-ignore
      resolver: zodResolver(ChatInputSchema),
      defaultValues: {
        content: "",
      },
    }),
    isLoading: boolean = form.formState.isSubmitting,
    { onOpen } = useModalStore(),
    Router = useRouter();

  const onSubmit = async ({ content }: ChatInputSchemaType) => {
    try {
      await axios
        .post(
          qs.stringifyUrl({
            url: apiUrl,
            query: query,
          }),
          { content: content },
        )
        .then(() => {
          form.reset();
          Router.refresh();
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          async ({ content }) => await onSubmit({ content }),
        )}
        className=""
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    onClick={() =>
                      onOpen("messageFile", {
                        apiUrl: apiUrl,
                        query: query,
                      })
                    }
                    disabled={isLoading}
                    className="absolute top-7 left-8 h-6 w-6 bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition-all rounded-full p-1 flex items-center justify-center"
                  >
                    <PlusIcon className="text-zinc-200 dark:text-zinc-600 " />
                  </button>
                  <Input
                    placeholder="type your message here ..."
                    {...field}
                    disabled={isLoading}
                    className="px-16 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                  />
                  <div className="absolute top-7 right-8">
                    <EmojiPicker
                      onChange={(emoji) =>
                        field.onChange(`${field.value} ${emoji}`)
                      }
                    />
                  </div>
                </div>
              </FormControl>
              {/* <FormMessage /> */}
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ChatInput;
