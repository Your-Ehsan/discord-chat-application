'use client'
import { useModalStore } from "@/hooks/useModalStore";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { leaveServer } from "@/lib/actions/leaveServer";
import ConfirmModalContent from "./modal-content/ConfirmModalContent";

const LeaveServerModal = () => {
  const [Loading, setLoading] = useState<boolean>(false),
    Router = useRouter();

  const { isOpen, onClose, type, data } = useModalStore(),
    { server } = data,
    IsModalOPen: boolean = isOpen && type === "leaveServer";

  return (
    <ConfirmModalContent
      modalName={server?.name}
      IsModalOPen={IsModalOPen}
      Loading={Loading}
      modalAction="leave"
      modalType="server"
      modalActionBtn={async () =>
        await leaveServer(server?.id, Router, onClose, setLoading)
      }
      modalEndline="you can join again using invitation."
    />
  );
};

export default LeaveServerModal;
