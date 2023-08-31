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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { initialModalformSchema } from "@/lib/schemas";
import { initialModalformValuesTypes } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

const CreateServerModalContent = ({
  isOpen,
  allowedClose,
  onClose,
}: {
  onClose?: () => void;
  allowedClose: boolean;
  isOpen: boolean;
}) => {
  const form = useForm<initialModalformValuesTypes>({
    //@ts-ignore
    resolver: zodResolver(initialModalformSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });
  const Router = useRouter();
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: initialModalformValuesTypes) => {
    console.log(values);
    try {
      await axios
        .post("/api/servers", values)
        .then(() => {
          form.reset();
          Router.refresh();
          if (onClose) {
            onClose();
          }
          console.log("server created successfully");
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(`Getting Error while creating server ${error}`);
    }
  };

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
        {/* Dilaof Header */}
        <DialogHeader className="pt-8 px-6">
          {/* Title */}
          <DialogTitle className="text-2xl text-center">
            customize your server
          </DialogTitle>
          {/* Description */}
          <DialogDescription className="text-zinc-500">
            Give your server a personality with a name and an image. you can
            always change it later.
          </DialogDescription>
        </DialogHeader>
        {/* Form component */}
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
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
                        <FormLabel className="uppercase text-xs font-bold text-zinc-400">
                          {/* label for image upload section */}
                          Upload Image
                        </FormLabel>
                        {/* Form description */}
                        <FormDescription>
                          This is description of file upload section
                        </FormDescription>
                        {/* form control section */}
                        <FormControl>
                          <FileUpload
                            endpoint={"serverImage"}
                            onChange={field.onChange}
                            value={field.value}
                          />
                        </FormControl>
                        {/* form message */}
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
                {isLoading ? "Creating.." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateServerModalContent;
