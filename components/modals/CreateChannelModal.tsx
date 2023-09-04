"use client";
import { useModalStore } from "@/hooks/useModalStore";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChannelType } from "@prisma/client";
import { CreateChannelTypes } from "@/lib/types";
import { CreateChannelSchema } from "@/lib/schemas";
import { createChannel } from "@/lib/actions/createChannel";
import ChannelModalContent from "./modal-content/ChannelModalContent";

const CreateChannelModal = () => {
  const [Loading, setLoading] = useState<boolean>(false),
    Router = useRouter(),
    params = useParams();

  const { isOpen, onClose, type, data } = useModalStore(),
    { server, channelType } = data,
    IsModalOPen: boolean = isOpen && type === "createChannel";

  const form = useForm<CreateChannelTypes>({
    //@ts-ignore
    resolver: zodResolver(CreateChannelSchema),
    defaultValues: {
      name: "",
      type: ChannelType.TEXT,
    },
  });

  useEffect(() => {
    channelType && form.setValue("type", channelType);
  }, [channelType, form]);

  return (
    <ChannelModalContent
      IsModalOPen={IsModalOPen}
      Loading={Loading}
      channelAction="create"
      channelForm={form}
      serverName={server?.name}
      channelModalBtn={form.handleSubmit((values) =>
        createChannel(
          values,
          params?.serverId,
          form,
          Router,
          onClose,
          setLoading,
        ),
      )}
    />

    // <Dialog open={IsModalOPen} onOpenChange={onClose}>
    //   <DialogContent className="p-8 overflow-hidden">
    //     <DialogHeader className="pt-8 px-6">
    //       <DialogTitle className="text-2xl">
    //         {!server ? "Create Channel" : `Create Channel for ${server.name}`}
    //       </DialogTitle>
    //       <DialogDescription className="text-zinc-500 capitalize">
    //         create audio, video or chat channels to communicate with your
    //         server&apos;s members in realtime
    //       </DialogDescription>
    //     </DialogHeader>
    //     <div className="p-6">
    //       <Form {...form}>
    //         <form
    //           onSubmit={form.handleSubmit(
    //             async (e) =>
    //               await createChannel(
    //                 e,
    //                 params?.serverId,
    //                 form,
    //                 Router,
    //                 onClose,
    //                 setLoading,
    //               ),
    //           )}
    //           className="w-full space-y-6"
    //         >
    //           <FormField
    //             control={form.control}
    //             name="name"
    //             render={({ field }) => (
    //               <FormItem>
    //                 <FormLabel className="capitalize">Channel name</FormLabel>
    //                 <FormControl>
    //                   <Input
    //                     className=" text-zinc-300/80"
    //                     autoFocus={true}
    //                     placeholder="Channel name"
    //                     {...field}
    //                   />
    //                 </FormControl>
    //                 <FormMessage />
    //               </FormItem>
    //             )}
    //           />
    //           <FormField
    //             control={form.control}
    //             name="type"
    //             render={({ field }) => (
    //               <FormItem>
    //                 <FormLabel className="capitalize">Channel type</FormLabel>
    //                 <Select
    //                   onValueChange={field.onChange}
    //                   defaultValue={field.value}
    //                 >
    //                   <FormControl>
    //                     <SelectTrigger className={"capitalize"}>
    //                       <SelectValue placeholder="Select Channel Type" />
    //                     </SelectTrigger>
    //                   </FormControl>
    //                   <SelectContent className="">
    //                     {Object.values(ChannelType).map((type) => {
    //                       return (
    //                         <SelectItem className="" value={type} key={type}>
    //                           <span className="capitalize flex items-center">
    //                             {type}
    //                           </span>
    //                         </SelectItem>
    //                       );
    //                     })}
    //                   </SelectContent>
    //                 </Select>
    //                 <FormMessage />
    //               </FormItem>
    //             )}
    //           />
    //           <div className="flex justify-end">
    //             <Button disabled={Loading} variant={"primary"} type="submit">
    //               {Loading ? "creating.." : "create"}
    //             </Button>
    //           </div>
    //         </form>
    //       </Form>
    //     </div>
    //   </DialogContent>
    // </Dialog>
  );
};

export default CreateChannelModal;
