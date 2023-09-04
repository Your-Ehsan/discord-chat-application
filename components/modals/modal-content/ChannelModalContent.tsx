import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useModalStore } from "@/hooks/useModalStore";
import { ChannelType } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

type ChannelModalContentProps = {
  IsModalOPen: boolean;
  channelAction: "edit" | "create";
  serverName: string | undefined;
  channelForm: UseFormReturn<
    {
      type: ChannelType;
      name: string;
    },
    any,
    undefined
  >;
  Loading: boolean;
  channelModalBtn: () => Promise<void>;
};

const ChannelModalContent = ({
  IsModalOPen,
  channelAction,
  serverName,
  channelForm,
  Loading,
  channelModalBtn,
}: ChannelModalContentProps) => {
  const { onClose } = useModalStore();
  return (
    <Dialog open={IsModalOPen} onOpenChange={onClose}>
      <DialogContent className="p-8 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl capitalize">
            {!serverName ? (
              <span>{channelAction} Channel</span>
            ) : (
              <span>
                {channelAction} Channel for {serverName}
              </span>
            )}
          </DialogTitle>
          <DialogDescription className="text-zinc-500 capitalize">
            create audio, video or chat channels to communicate with your
            server&apos;s members in realtime
          </DialogDescription>
        </DialogHeader>
        <div className="p-6">
          <Form {...channelForm}>
            <form onSubmit={channelModalBtn} className="w-full space-y-6">
              <FormField
                control={channelForm.control}
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
                control={channelForm.control}
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
                            <SelectItem
                              className="capitalize"
                              value={type}
                              key={type}
                            >
                              <span className="capitalize flex items-center">
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
                <Button className="flex items-center" disabled={Loading} variant={"primary"} type="submit">
                  {channelAction === "create" ? (
                    Loading ? (
                      <>
                        <span>Creating</span>
                        <Loader2 className="animate-spin h-4 w-4 mx-2 transition-all" />
                      </>
                    ) : (
                      <span>Create</span>
                    )
                  ) : channelAction === "edit" ? (
                    Loading ? (
                      <>
                        <span>Editing</span>
                        <Loader2 className="animate-spin h-4 w-4 mx-2 transition-all" />
                      </>
                    ) : (
                      <span>Edit</span>
                    )
                  ) : null}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChannelModalContent;
