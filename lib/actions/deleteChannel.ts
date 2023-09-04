import qs from "query-string";
import axios from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { Dispatch, SetStateAction } from "react";

const deleteChannel = async (
  channelId: string | undefined,
  serverId: string | undefined,
  Router: AppRouterInstance,
  onClose: () => void,
  setLoding: Dispatch<SetStateAction<boolean>>,
) => {
  try {
    setLoding(true);
    await axios
      .delete(
        qs.stringifyUrl({
          url: `/api/channels/${channelId}/delete`,
          query: {
            serverId: serverId,
          },
        }),
      )
      .then(() => {
        onClose();
        setLoding(false);
        Router.refresh();
      });
  } catch (error) {
    console.log(`error while deleting the whole server --> ${error}`);
  } finally {
    setLoding(false);
  }
};

export { deleteChannel };
