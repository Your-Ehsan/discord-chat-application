import axios from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { Dispatch, SetStateAction } from "react";

const leaveServer = async (
  serverId: string | undefined,
  Router: AppRouterInstance,
  onClose: () => void,
  setLoding: Dispatch<SetStateAction<boolean>>,
) => {
  try {
    setLoding(true);
    await axios
      .patch(`/api/servers/${serverId}/leave`, { serverId: serverId })
      .then(() => {
        Router.refresh();
        // Router.push("/");
        setLoding(false);
        onClose();
      });
  } catch (error) {
    console.log(`error while deleting user from database --> ${error}`);
  } finally {
    setLoding(false);
  }
};

export { leaveServer };
