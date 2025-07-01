import { useAuthStore } from "@/features/auth/stores/auth.store";
import { chatSocket } from "@/shared/configs/socket.config";
import React, { createContext, useContext, useEffect, useState } from "react";
import type { IChat, IMessage } from "../types";

interface IChatContext {
  onlineUsers: string[];
  messages: IMessage[];
  setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
  currentId: string | null;
  setCurrentId: React.Dispatch<React.SetStateAction<string | null>>;
  setChats: React.Dispatch<React.SetStateAction<IChat[]>>;
}

export const ChatContext = createContext<IChatContext>({
  onlineUsers: [],
  messages: [],
  setMessages: () => {},
  currentId: null,
  setCurrentId: () => {},
  setChats: () => {},
});

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();

  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [chats, setChats] = useState<IChat[]>([]);

  useEffect(() => {
    // if user is login, connect to socket
    if (!user) {
      chatSocket.disconnect();
      return;
    }
    chatSocket.auth = { authId: user._id };
    chatSocket.connect();

    // listen to events
    chatSocket.on("onlineUsers", handleOnlineUsers);
    chatSocket.on("send-message", handleSendMessage);
    chatSocket.on("join-room", handleJoinRoom);

    return () => {
      chatSocket.off("onlineUsers", handleOnlineUsers);
      chatSocket.off("send-message", handleSendMessage);
      chatSocket.off("join-room", handleJoinRoom);
      // chatSocket.disconnect();
    };
  }, [user, currentId]);

  const handleOnlineUsers = (users: string[]) => {
    setOnlineUsers(users);
  };
  const handleSendMessage = (data: IMessage) => {
    if (
      currentId === data.sender._id ||
      (currentId === data.room._id && user?._id !== data.sender._id)
    ) {
      setMessages((prev) => [...prev, data]);
    }
  };
  const handleJoinRoom = (data: IChat) => {
    chatSocket.emit("join-room", data);
  };

  useEffect(() => {
    setMessages([]);
  }, [currentId]);

  useEffect(() => {
    if (chats.length === 0) return;
    chatSocket.emit("join-rooms", chats);
  }, [chats]);

  return (
    <ChatContext.Provider
      value={{
        onlineUsers,
        messages,
        setMessages,
        currentId,
        setCurrentId,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
