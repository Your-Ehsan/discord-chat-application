"use client";
import ServerModalContent from "./modal-content/ServerModalContent";
import { useModalStore } from "@/hooks/useModalStore";
import { serverModalformValuesTypes } from "@/lib/types";
import { useForm } from "react-hook-form";
import { serverModalformSchema } from "@/lib/schemas";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { editServer } from "@/lib/actions/editServer";

const EditServerModal = () => {
  const { isOpen, onClose, type, data } = useModalStore(),
    { server } = data,
    isModalOpen: boolean = isOpen && type === "editServer";

  const form = useForm<serverModalformValuesTypes>({
      //@ts-ignore
      resolver: zodResolver(serverModalformSchema),
      defaultValues: {
        name: "",
        imageUrl: "",
      },
    }),
    isLoading = form.formState.isSubmitting,
    Router = useRouter();

  useEffect(() => {
    if (server && isOpen) {
      form.setValue("name", server.name);
      form.setValue("imageUrl", server.imageUrl);
    }
  }, [server, form, isOpen]);

  return (
    <ServerModalContent
      formSubmit={form.handleSubmit(
        async (values) =>
          await editServer(values, form, Router, onClose, server?.id),
      )}
      isOpen={isModalOpen}
      allowedClose={true}
      onClose={onClose}
      type="editServer"
      form={form}
      isLoading={isLoading}
    />
  );
};

export default EditServerModal;
