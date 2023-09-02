import qs from "query-string";
import { MemberRole } from "@prisma/client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { Dispatch, SetStateAction } from "react";
import { ModalData, ModalType } from "../types";
import axios from "axios";

const changeMemberRole = async (
  memberId: string,
  role: MemberRole,
  setLoadingId: Dispatch<SetStateAction<string>>,
  serverId: string,
  Router: AppRouterInstance,
  onOpen: (type: ModalType, data?: ModalData | undefined) => void,
) => {
  try {
    setLoadingId(memberId);
    await axios
      .patch(
        qs.stringifyUrl({
          url: `/api/members/${memberId}`,
          query: {
            serverId: serverId,
            memberId: memberId,
          },
        }),
        { role: role },
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

export { changeMemberRole };
