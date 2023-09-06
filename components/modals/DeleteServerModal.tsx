'use client'
import { useModalStore } from "@/hooks/useModalStore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteServer } from "@/lib/actions/deleteServer";

import ConfirmModalContent from "./modal-content/ConfirmModalContent";

const DeleteServerModal = () => {
  const [Loading, setLoading] = useState<boolean>(false),
    Router = useRouter();

  const { isOpen, onClose, type, data } = useModalStore(),
    { server } = data,
    IsModalOPen: boolean = isOpen && type === "deleteServer";

  return (
    <ConfirmModalContent
    modalName={server?.name}
      IsModalOPen={IsModalOPen}
      Loading={Loading}
      modalAction="delete"
      modalType="server"
      modalActionBtn={async () =>
        await deleteServer(server?.id, Router, onClose, setLoading)
      }
      modalEndline="you can also make a new server with this name"
    />
  );
};

export default DeleteServerModal;
