import { ServerFormType, serverModalformValuesTypes } from "@/lib/types";
import axios from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

const createServer = async (
  values: serverModalformValuesTypes,
  form: ServerFormType,
  Router: AppRouterInstance,
  onClose?: () => void,
) => {
  try {
    await axios
      .post("/api/servers", values)
      .then(() => {
        form.reset();
        Router.refresh();
        if (onClose) {
          onClose();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(`Getting Error while creating server ${error}`);
  }
};

export { createServer };
