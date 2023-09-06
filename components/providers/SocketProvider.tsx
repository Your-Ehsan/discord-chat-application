"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { io as clientIO } from "socket.io-client";

type SocketContextType = {
  socket: any | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
    isConnected: false,
    socket: null,
  }), useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [Socket, setSocket] = useState(null),
    [Connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    const socketInstance = new (clientIO as any)(
      process.env.NEXT_PUBLIC_SITE_URL!,
      {
        path: "/api/socket/io",
        addTrailingSlash: false,
      },
    );

    socketInstance.on("connect", () => {
      setConnected(true);
    });

    socketInstance.on("disconnect", () => {
      setConnected(true);
    });

    setSocket(socketInstance);

    return () => socketInstance.disconnect();
  }, []);
  return (
    <SocketContext.Provider value={{ isConnected: Connected, socket: Socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export { useSocket };
export default SocketProvider;
