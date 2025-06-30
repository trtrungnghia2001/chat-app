import { useAuthStore } from "@/features/auth/stores/auth.store";
import { chatSocket } from "@/shared/configs/socket.config";
import React, { createContext, useContext, useEffect, useState } from "react";
import { IMessage } from "../types";

export const ChatContext = createContext({});

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();

  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    // if user is login, connect to socket
    if (!user) return;
    chatSocket.auth = { authId: user._id };
    chatSocket.connect();

    // listen to events
    chatSocket.on("onlineUsers", handleOnlineUsers);

    return () => {
      chatSocket.off("onlineUsers", handleOnlineUsers);
      chatSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    setMessages([]);
  }, [currentId]);

  const handleOnlineUsers = (users: string[]) => {
    setOnlineUsers(users);
  };

  console.log({ onlineUsers });

  return (
    <ChatContext.Provider
      value={{ onlineUsers, messages, setMessages, setCurrentId }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
