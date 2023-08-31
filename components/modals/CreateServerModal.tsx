"use client";

import { useModalStore } from "@/hooks/useModalStore";
import CreateServerModalContent from "./modal-content/CreateServerModalContent";

const CreateServerModal = () => {
  const { isOpen, onClose, type } = useModalStore(),
    isModalOpen: boolean = isOpen && type === "createServer";

  return (
    <CreateServerModalContent
      isOpen={isModalOpen}
      allowedClose={true}
      onClose={onClose}
    />
  );
};

export default CreateServerModal;
