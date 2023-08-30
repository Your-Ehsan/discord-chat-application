"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { initialModalformValuesTypes } from "@/lib/types";
import { initialModalformSchema } from "@/lib/schemas";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import FileUpload from "../FileUpload";

const InitialModal = () => {
  const [Ismounted, setIsmounted] = useState<boolean>(false);

  useEffect(() => {
    setIsmounted(true);
  }, []);

  const form = useForm<initialModalformValuesTypes>({
    //@ts-ignore
    resolver: zodResolver(initialModalformSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: initialModalformValuesTypes) => {
    console.log(values);
  };

  // if (!Ismounted) return null;
  return (
    <Dialog open={Ismounted}>
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
                      <FormItem>
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
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InitialModal;
