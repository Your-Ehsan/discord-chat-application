"use client";

import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useTheme } from "next-themes";
import { SmileIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type EmojiPickerType = {
  onChange: (value: string) => void;
};
const EmojiPicker = ({ onChange }: EmojiPickerType) => {
  const { resolvedTheme } = useTheme();
  return (
    <Popover>
      <PopoverTrigger>
        <SmileIcon className="text-zinc-500 dark:first-letter:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-all" />
      </PopoverTrigger>
      <PopoverContent
        side={"right"}
        sideOffset={40}
        className={
          "bg-transparent border-none shadow-none drop-shadow-none mb-16"
        }
      >
        <Picker
          theme={resolvedTheme}
          data={data}
          onEmojiSelect={({ native }: { native: any }) => onChange(native)}
        />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
