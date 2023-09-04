"use client";
import { useModalStore } from "@/hooks/useModalStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmModalContent from "./modal-content/ConfirmModalContent";
import { deleteChannel } from "@/lib/actions/deleteChannel";

const DeleteChannelModal = () => {
  const [Loading, setLoading] = useState<boolean>(false),
    Router = useRouter();

  const { isOpen, onClose, type, data } = useModalStore(),
    { channel, server } = data,
    IsModalOPen: boolean = isOpen && type === "deleteChannel";
  return (
    <ConfirmModalContent
      modalName={channel?.name}
      IsModalOPen={IsModalOPen}
      Loading={Loading}
      modalAction="delete"
      modalType="channel"
      modalActionBtn={async () =>
        await deleteChannel(
          channel?.id,
          server?.id,
          Router,
          onClose,
          setLoading,
        )
      }
      modalEndline="Note that This action is not recoverable"
    />
  );
};

export default DeleteChannelModal;
