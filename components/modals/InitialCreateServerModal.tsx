"use client";

import ServerModalContent from "./modal-content/ServerModalContent";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { serverModalformValuesTypes } from "@/lib/types";
import { serverModalformSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { createServer } from "@/lib/actions/createServer";
import { useRouter } from "next/navigation";

const InitialCreateServerModal = () => {
  const [Ismounted, setIsmounted] = useState<boolean>(false);

  useEffect(() => {
    setIsmounted(true);
  }, []);

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
      formSubmit={form.handleSubmit(
        async (values) => await createServer(values, form, Router),
      )}
      isOpen={Ismounted}
      type="createServer"
      allowedClose={false}
      isLoading={isLoading}
      form={form}
    />
  );
};

export default InitialCreateServerModal;
