"use client";
import { useModalStore } from "@/hooks/useModalStore";
import { useState } from "react";
import { useRouter } from "next/navigation";

import ConfirmModalContent from "./modal-content/ConfirmModalContent";
import axios from "axios";
import queryString from "query-string";

const DeleteMessageModal = () => {
  const [Loading, setLoading] = useState<boolean>(false),
    Router = useRouter();

  const { isOpen, onClose, type, data } = useModalStore(),
    { query, apiUrl } = data,
    IsModalOPen: boolean = isOpen && type === "deleteMessage";

  return (
    <ConfirmModalContent
      modalName={undefined}
      IsModalOPen={IsModalOPen}
      Loading={Loading}
      modalAction="delete"
      modalType="message"
      modalActionBtn={async () => {
        try {
          setLoading(true);
          await axios
            .delete(
              queryString.stringifyUrl({
                url: apiUrl as string,
                query: query,
              }),
            )
            .then(() => {
              onClose();
              setLoading(false);
            });
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }}
      modalEndline="This action is permanent"
    />
  );
};

export default DeleteMessageModal;
