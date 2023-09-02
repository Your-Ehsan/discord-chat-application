"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useModalStore } from "@/hooks/useModalStore";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChannelType } from "@prisma/client";
import { Input } from "../ui/input";
import { CreateChannelTypes } from "@/lib/types";
import { CreateChannelSchema } from "@/lib/schemas";
import { createChannel } from "@/lib/actions/createChannel";

const CreateChannelModal = () => {
  const [Loading, setLoading] = useState<boolean>(false),
    Router = useRouter(),
    params = useParams();

  const { isOpen, onClose, type, data, onOpen } = useModalStore(),
    { server } = data,
    IsModalOPen: boolean = isOpen && type === "createChannel";

  const form = useForm<CreateChannelTypes>({
    //@ts-ignore
    resolver: zodResolver(CreateChannelSchema),
    defaultValues: {
      name: "",
      type: ChannelType.TEXT,
    },
  });

  return (
    <Dialog open={IsModalOPen} onOpenChange={onClose}>
      <DialogContent className="p-8 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl">
            {!server ? "Create Channel" : `Create Channel for ${server.name}`}
          </DialogTitle>
          <DialogDescription className="text-zinc-500 capitalize">
            create audio, video or chat channels to communicate with your
            server&apos;s members in realtime
          </DialogDescription>
        </DialogHeader>
        <div className="p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(
                async (e) =>
                  await createChannel(
                    e,
                    params?.serverId,
                    form,
                    Router,
                    onClose,
                    setLoading,
                  ),
              )}
              className="w-full space-y-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">Channel name</FormLabel>
                    <FormControl>
                      <Input
                        className=" text-zinc-300/80"
                        autoFocus={true}
                        placeholder="Channel name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">Channel type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className={"capitalize"}>
                          <SelectValue placeholder="Select Channel Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="">
                        {Object.values(ChannelType).map((type) => {
                          return (
                            <SelectItem className="" value={type} key={type}>
                              <span className="capitalize flex items-center">
                                {/* <Icon name="text" className="mx-2 pr-1 w-7 h-4 border-r border-zinc-400/80"/>  */}
                                {type}
                              </span>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button disabled={Loading} variant={"primary"} type="submit">
                  {Loading ? "creating.." : "create"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelModal;
