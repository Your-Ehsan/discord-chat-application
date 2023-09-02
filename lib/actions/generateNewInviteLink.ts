import axios from "axios";
import { SetStateAction } from "react";
import { ModalData, ModalType } from "@/lib/types";

const generateNewInviteLink: (
  setLoading: (value: SetStateAction<boolean>) => void,
  onOpen: (type: ModalType, data?: ModalData | undefined) => void,
  serverId: string | undefined,
) => Promise<void> = async (setLoading, onOpen, serverId) => {
  try {
    setLoading(true);
    const res = await axios
      .patch(`/api/servers/${serverId}/invite`)
      .then(({ data }) => {
        onOpen("invite", { server: data });
      });
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

export { generateNewInviteLink };
