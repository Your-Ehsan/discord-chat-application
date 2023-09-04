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
import { ModalType, ServerFormType } from "@/lib/types";
import { Loader2 } from "lucide-react";

const ServerModalContent = ({
  isOpen,
  allowedClose,
  onClose,
  form,
  isLoading,
  type,
  formSubmit,
}: {
  onClose?: () => void;
  allowedClose: boolean;
  isOpen: boolean;
  form: ServerFormType;
  isLoading: boolean;
  type: ModalType;
  formSubmit: () => Promise<void>;
}) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        if (allowedClose && onClose) {
          form.reset();
          onClose();
        }
      }}
    >
      <DialogContent className="p-8 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-3xl capitalize">
            {type === "createServer"
              ? "Create a New server"
              : type === "editServer" && "Customize your server"}
          </DialogTitle>
          <DialogDescription className="text-zinc-500">
            Give your server a personality with a name and an image. you can
            always change it later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-8" onSubmit={formSubmit}>
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => {
                    return (
                      <FormItem
                        className={"flex justify-center items-center flex-col"}
                      >
                        <FormControl>
                          <FileUpload
                            endpoint={"serverImage"}
                            onChange={field.onChange}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold text-zinc-400">
                        Server name
                      </FormLabel>
                      <FormControl>
                        <Input
                          autoFocus={true}
                          disabled={isLoading}
                          className=" border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          placeholder="Enter Server Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <DialogFooter className="px-6 py-4">
              <Button disabled={isLoading} className="" variant={"primary"}>
                {/* {type === "createServer"
                  ? isLoading
                    ? "Creating.."
                    : "Create"
                  : type === "editServer" && isLoading
                  ? "Updating.."
                  : "update"} */}
                {type === "createServer" ? (
                  isLoading ? (
                    <>
                      <span>Creating</span>
                      <Loader2 className="animate-spin h-4 w-4 mx-2 transition-all" />
                    </>
                  ) : (
                    <span>Create</span>
                  )
                ) : type === "editServer" ? (
                  isLoading ? (
                    <>
                      <span>Editing</span>
                      <Loader2 className="animate-spin h-4 w-4 mx-2 transition-all" />
                    </>
                  ) : (
                    <span>Edit</span>
                  )
                ) : null}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ServerModalContent;
