"use client";
import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { useModalStore } from "@/hooks/useModalStore";
import { ChatInputSchema, FileInputSchema } from "@/lib/schemas";
import {
  ChatInputSchemaType,
  FileInputSchemaType,
  ModalType,
  ServerFormType,
} from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import queryString from "query-string";
import { useForm } from "react-hook-form";

const MessageFileModal = () => {
  const form = useForm<FileInputSchemaType>({
      //@ts-ignore
      resolver: zodResolver(FileInputSchema),
      defaultValues: {
        fileUrl: "",
      },
    }),
    isLoading = form.formState.isSubmitting;
  //   Router = useRouter();

  const { onClose, type, data, isOpen } = useModalStore(),
    ModalOpen: boolean = isOpen && type === "messageFile",
    { apiUrl, query } = data;

    // TODO: fix this user experience
  const onSubmit = async (values: FileInputSchemaType) => {
    try {
      await axios
        .post(
          queryString.stringifyUrl({
            url: apiUrl as string,
            query: query,
          }),
          { ...values, content: values.fileUrl },
        )
        .then(() => onClose());
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Dialog
      open={ModalOpen}
      onOpenChange={() => {
        form.reset();
        onClose();
      }}
    >
      <DialogContent showicon={true} className="p-8 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          {/* <DialogTitle className="text-3xl capitalize">
            {type === "createServer"
              ? "Create a New server"
              : type === "editServer" && "Customize your server"}
          </DialogTitle> */}
          {/* <DialogDescription className="text-zinc-500">
            Give your server a personality with a name and an image. you can
            always change it later.
          </DialogDescription> */}
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-8"
            onSubmit={form.handleSubmit(async (e) => await onSubmit(e))}
          >
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => {
                    return (
                      <FormItem
                        className={"flex justify-center items-center flex-col"}
                      >
                        <FormControl>
                          <FileUpload
                            endpoint={"messageFile"}
                            onChange={field.onChange}
                            value={field.value as string}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
            </div>
            <DialogFooter className="px-6 py-4">
              <Button
                disabled={isLoading}
                className="transition-all"
                variant={"primary"}
                type="submit"
              >
                {isLoading ? (
                  <>
                    <span>sending</span>
                    <Loader2 className="animate-spin h-4 w-4 mx-2 transition-all" />
                  </>
                ) : (
                  <span>send</span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageFileModal;
