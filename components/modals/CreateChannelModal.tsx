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
  );
};

export default CreateChannelModal;
