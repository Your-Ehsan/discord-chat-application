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
import { editChannel } from "@/lib/actions/editChannel";

const EditChannelModal = () => {
  const [Loading, setLoading] = useState<boolean>(false),
    Router = useRouter();
    // params = useParams();

  const { isOpen, onClose, type, data } = useModalStore(),
    { server,  channel } = data,
    IsModalOPen: boolean = isOpen && type === "editChannel";

  const form = useForm<CreateChannelTypes>({
    //@ts-ignore
    resolver: zodResolver(CreateChannelSchema),
    defaultValues: {
      name: "",
      type: ChannelType.TEXT,
    },
  });

  useEffect(() => {
    if (channel) {
      form.setValue("type", channel.type);
      form.setValue("name", channel.name);
    }
  }, [form, channel]);

  return (
    <ChannelModalContent
      IsModalOPen={IsModalOPen}
      Loading={Loading}
      channelAction="edit"
      channelForm={form}
      serverName={server?.name}
      channelModalBtn={form.handleSubmit((values) =>
        editChannel(
          values,
          server?.id,
          channel?.id,
          Router,
          onClose,
          setLoading,
        ),
      )}
    />
  );
};

export default EditChannelModal;
