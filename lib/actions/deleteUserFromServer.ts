import qs from "query-string";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { Dispatch, SetStateAction } from "react";
import { ModalData, ModalType } from "../types";
import axios from "axios";

const deleteUserFromServer = async (
  memberId: string,
  setLoadingId: Dispatch<SetStateAction<string>>,
  serverId: string,
  Router: AppRouterInstance,
  onOpen: (type: ModalType, data?: ModalData | undefined) => void,
) => {
  try {
    setLoadingId(memberId);
    await axios
      .delete(
        qs.stringifyUrl({
          url: `/api/members/${memberId}`,
          query: {
            serverId: serverId,
          },
        }),
      )
      .then(({ data }) => {
        Router.refresh();
        onOpen("members", { server: data });
        setLoadingId("");
      });
  } catch (error) {
    console.log(error);
  } finally {
    setLoadingId("");
  }
};

export { deleteUserFromServer };
