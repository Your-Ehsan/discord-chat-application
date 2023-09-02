import { ServerFormType, serverModalformValuesTypes } from "@/lib/types";
import axios from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

const editServer = async (
  values: serverModalformValuesTypes,
  form: ServerFormType,
  Router: AppRouterInstance,
  onClose: () => void,
  serverId: string | undefined,
) => {
  try {
    await axios
      .patch(`/api/servers/${serverId}`, values)
      .then(() => {
        form.reset();
        Router.refresh();
        onClose();
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(`Getting Error while creating server ${error}`);
  }
};

export { editServer };
