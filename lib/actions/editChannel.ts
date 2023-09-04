import axios from "axios";
import qs from "query-string";
import { UseFormReturn } from "react-hook-form";
import { CreateChannelTypes } from "../types";
import { Dispatch, SetStateAction } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { ChannelType } from "@prisma/client";

const editChannel = async (
  { name, type }: CreateChannelTypes,
  serverId: string | undefined,
  channelId: string | undefined,
//   form: UseFormReturn<
//     {
//       type: ChannelType;
//       name: string;
//     },
//     any,
//     undefined
//   >,
  Router: AppRouterInstance,
  onClose: () => void,
  setLoading: Dispatch<SetStateAction<boolean>>,
) => {
  try {
    setLoading(true);
    await axios
      .patch(
        qs.stringifyUrl({
          url: `/api/channels/${channelId}/update`,
          query: {
            serverId: serverId,
          },
        }),
        { name, type },
      )
      .then(() => {
        // form.reset();
        Router.refresh();
        setLoading(false);
        onClose();
      });
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

export { editChannel };
