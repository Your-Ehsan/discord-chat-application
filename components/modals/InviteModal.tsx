"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModalStore } from "@/hooks/useModalStore";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CheckIcon, CopyIcon, SymbolIcon } from "@radix-ui/react-icons";
import { useOrigin } from "@/hooks/useOrigin";
import { useState } from "react";
import axios from "axios";

const InviteModal = () => {
  const [Loading, setLoading] = useState<boolean>(false),
    [Copy, setCopy] = useState<boolean>(false);

  const { isOpen, onClose, type, data, onOpen } = useModalStore(),
    { server } = data,
    IsModalOPen: boolean = isOpen && type === "invite",
    origin: string = useOrigin(),
    inviteLink: string = `${origin}/invite/${server?.inviteCode}`;

  const onCopy: () => Promise<void> = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopy(true);
      setTimeout(() => {
        setCopy(false);
      }, 1200);
    } catch (error) {
      console.log(error);
    } finally {
      setCopy(false);
    }
  };

  const onGenerate = async () => {
    try {
      setLoading(true);
      const res = await axios
        .patch(`/api/servers/${server?.id}/invite`)
        .then(({ data }) => {
          onOpen("invite", { server: data });
        });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={IsModalOPen} onOpenChange={onClose}>
      <DialogContent className="p-8 overflow-hidden">
        {/* Dilaof Header */}
        <DialogHeader className="pt-8 px-6">
          {/* Title */}
          <DialogTitle className="text-2xl">Invite Your Friends!</DialogTitle>
          {/* Description */}
          <DialogDescription className="text-zinc-500">
            Share your server with your friends and family.
          </DialogDescription>
        </DialogHeader>
        {/* Invite Modal content */}
        <div className="p-6">
          <Label className="uppercase text-xs font-bold">
            Server invite link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              disabled={Loading}
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 font-mono focus-visible:ring-offset-0"
              value={inviteLink}
              readOnly={true}
            />
            <Button
              disabled={Loading}
              size={"icon"}
              variant={"default"}
              onClick={async () => await onCopy()}
            >
              {Copy ? (
                <CheckIcon className="h-4 w-4 " />
              ) : (
                <CopyIcon className="w-4 h-4" />
              )}
            </Button>
          </div>
          <Button
            disabled={Loading}
            variant={"link"}
            size={"sm"}
            className="text-xs text-zinc-500 mt-2"
            onClick={async () => await onGenerate()}
          >
            Generate New
            <SymbolIcon
              className={`w-4 h-4 ml-2 ${Loading && "animate-spin"}`}
            />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
