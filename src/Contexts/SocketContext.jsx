import { createContext, useState } from "react";
import SocketIoClient from "socket.io-client";
import { WS_SERVER } from "../configs/serverConfig";

const socket = SocketIoClient(WS_SERVER);

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [coloredBlocks, setColoredBlocks] = useState({});

  return (
    <SocketContext.Provider value={{ socket, coloredBlocks, setColoredBlocks }}>
      {children}
    </SocketContext.Provider>
  );
};
