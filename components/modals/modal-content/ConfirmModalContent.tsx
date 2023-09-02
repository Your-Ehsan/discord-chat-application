import { useModalStore } from "@/hooks/useModalStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import Icon from "@/components/Icon";

type ConfirmModalContentProps = {
  IsModalOPen: boolean;
  modalAction: "leave" | "delete";
  modalType: "server" | "channel";
  modalActionBtn: () => Promise<void>;
  modalEndline: string;
  Loading: boolean;
};

const ConfirmModalContent = ({
  modalAction,
  modalType,
  modalActionBtn,
  modalEndline,
  Loading,
  IsModalOPen,
}: ConfirmModalContentProps) => {
  const { isOpen, onClose, type, data } = useModalStore(),
    { server } = data;

  return (
    <Dialog open={IsModalOPen} onOpenChange={onClose}>
      <DialogContent className="p-8 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="capitalize text-2xl">
            {modalAction} {modalType}?
          </DialogTitle>
          <DialogDescription className="text-zinc-500 capitalize">
            {!server ? (
              <span>
                are you sure you want to {modalAction} this {modalType}?
              </span>
            ) : (
              <span>
                Are you sure you want to {modalAction} this{" "}
                <span className="font-bold">{server.name}</span> {modalType}?
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="p-6">
          <div className="">
            <div className="flex justify-end">
              <Button
                onClick={onClose}
                disabled={Loading}
                className="mr-2"
                variant={"ghost"}
              >
                cancel
              </Button>
              <Button
                disabled={Loading}
                className="ml-2 flex items-center duration-300"
                variant={"primary"}
                onClick={modalActionBtn}
              >
                {Loading ? (
                  <>
                    <span>{modalAction}</span>
                    <Icon
                      name="loader-2"
                      className="animate-spin mx-2 w-5 h-5"
                    />
                  </>
                ) : (
                  <span>{modalAction}</span>
                )}
              </Button>
            </div>
            <div className="">
              <span className=" text-zinc-500 dark:text-zinc-400 capitalize text-right text-xs font-thin my-2">
                {modalEndline}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmModalContent;
