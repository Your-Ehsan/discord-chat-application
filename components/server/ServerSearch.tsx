"use client";

import { ReactNode, useEffect, useState } from "react";
import Icon from "../Icon";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { useParams, useRouter } from "next/navigation";
import { serverCollectionType } from "@/lib/types";


type ServerSearchProps = {
  data: {
    label: string;
    type: serverCollectionType;
    data:
      | {
          icon: ReactNode;
          name: string;
          id: string;
        }[]
      | undefined;
  }[];
};

const ServerSearch = ({ data }: ServerSearchProps) => {
  const [Open, setOpen] = useState<boolean>(false),
    Router = useRouter(),
    Param = useParams();

  useEffect(() => {
    const downKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prevState) => !prevState);
      }
    };
    document.addEventListener("keydown", downKey);
    return () => document.removeEventListener("keydown", downKey);
  }, []);

  const onClick = async ({
    id,
    type,
  }: {
    id: string;
    type: serverCollectionType;
  }) => {
    setOpen(false);

    if (type === "member") {
      Router.push(`/servers/${Param?.serverId}/conversations/${id}`);
    }
    if (type === "channel") {
      Router.push(`/servers/${Param?.serverId}/channels/${id}`);
    }
  };

  return (
    <>
      <button
        className="group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition-all"
        onClick={() => setOpen(true)}
      >
        <Icon
          name="search"
          className="w-4 h-4 text-zinc-500 dark:text-zinc-400"
        />
        <span className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-300 transition-all">
          search
        </span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[8px] font-medium text-muted-foreground ml-auto">
          <Icon name="command" className="w-[8px] h-[8px]" /> + k
        </kbd>
      </button>
      <CommandDialog open={Open} onOpenChange={setOpen}>
        <CommandInput placeholder="search across your server" />
        <CommandList>
          <CommandEmpty>Not found ¯\_(ツ)_/¯</CommandEmpty>
          {data.map(({ data, label, type }) => {
            !data?.length && null;
            return (
              <CommandGroup key={label} heading={label}>
                {data?.map(({ icon, id, name }) => {
                  return (
                    <CommandItem
                      key={id}
                      onSelect={() => onClick({ id, type })}
                    >
                      {icon} <span>{name}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default ServerSearch;
