"use client";

import ServerModalContent from "./modal-content/ServerModalContent";
import { useModalStore } from "@/hooks/useModalStore";
import { serverModalformValuesTypes } from "@/lib/types";
import { useForm } from "react-hook-form";
import { serverModalformSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { createServer } from "@/lib/actions/createServer";
import { useRouter } from "next/navigation";

const CreateServerModal = () => {
  const { isOpen, onClose, type } = useModalStore(),
    isModalOpen: boolean = isOpen && type === "createServer";

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
  return (
    <ServerModalContent
      isOpen={isModalOpen}
      allowedClose={true}
      onClose={onClose}
      form={form}
      type={"createServer"}
      isLoading={isLoading}
      formSubmit={form.handleSubmit(
        async (values) =>
          await createServer(values, form, Router, onClose),
      )}
    />
  );
};

export default CreateServerModal;
