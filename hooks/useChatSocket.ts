import { useSocket } from "@/components/providers/SocketProvider";
import { MessageWithMember_Profile } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type useChatSocketType = {
  addKey: string;
  updateKey: string;
  queryKey: string;
};

const useChatSocket = ({ addKey, queryKey, updateKey }: useChatSocketType) => {
  const { socket } = useSocket(),
    queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    socket.on(updateKey, (message: MessageWithMember_Profile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0)
          return oldData;

        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            items: page.items.map((item: MessageWithMember_Profile) => {
              if (item.id === message.id) {
                return message;
              }
              return item;
            }),
          };
        });
        return {
          ...oldData,
          pages: newData,
        };
      });
    });
    socket.on(addKey, (message: MessageWithMember_Profile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [{ items: [message] }],
          };
        }
        const newData = [...oldData.pages];
        newData[0] = {
          ...newData[0],
          items: [message, ...newData[0].items],
        };
        return {
          ...oldData,
          pages: newData,
        };
      });
    });
    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    };
  }, [queryClient, addKey, queryKey, socket, updateKey]);
};

export { useChatSocket };
