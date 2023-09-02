import axios from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { Dispatch, SetStateAction } from "react";

const deleteServer = async (
  serverId: string | undefined,
  Router: AppRouterInstance,
  onClose: () => void,
  setLoding: Dispatch<SetStateAction<boolean>>,
) => {
  try {
    setLoding(true);
    await axios
      .delete(`/api/servers/${serverId}/delete`)
      .then(() => {
        Router.refresh();
        setLoding(false);
        // Router.push("/");
        onClose();
      });
  } catch (error) {
    console.log(`error while deleting the whole server --> ${error}`);
  } finally {
    setLoding(false);
  }
};

export { deleteServer };
