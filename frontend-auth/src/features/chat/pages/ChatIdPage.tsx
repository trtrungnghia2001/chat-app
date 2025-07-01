import useSearchParamsValue from "@/shared/hooks/useSearchParamsValue";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getMessagesIdApi, getRoomIdApi, getUserIdApi } from "../apis/chatApi";
import { useChatContext } from "../contexts/chat";
import ChatInput from "../components/ChatInput";
import { useEffect, useMemo, useRef } from "react";
import MessageCard from "../components/MessageCard";
import ChatHeader from "../components/ChatHeader";
import type { IUser } from "@/features/auth/types/auth";
import type { IRoom } from "../types";

const ChatIdPage = () => {
  const { id } = useParams();
  const { searchParams } = useSearchParamsValue();
  const type = searchParams.get("type");

  const getInfoIdResult = useQuery({
    queryKey: ["get", type, id],
    queryFn: async () => {
      if (type === "user") {
        return await getUserIdApi(id!);
      }
      return await getRoomIdApi(id!);
    },
    enabled: !!(type && id),
  });

  const { messages, setCurrentId } = useChatContext();
  useEffect(() => {
    setCurrentId(id!);
  }, [id]);

  const getMessagesIdApiResult = useQuery({
    queryKey: ["get", "message", type, id],
    queryFn: async () => {
      return await getMessagesIdApi(id!, type!);
    },
    enabled: !!(type && id),
  });

  const customMessages = useMemo(() => {
    let data = messages;

    if (getMessagesIdApiResult.isSuccess && getMessagesIdApiResult.data) {
      data = [...getMessagesIdApiResult.data.data, ...data];
    }
    return data;
  }, [getMessagesIdApiResult, messages]);

  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [customMessages]);

  return (
    <div className="flex flex-col justify-center h-screen">
      {/* top */}
      <ChatHeader
        user={
          type === "user" ? (getInfoIdResult.data?.data as IUser) : undefined
        }
        room={
          type === "room" ? (getInfoIdResult.data?.data as IRoom) : undefined
        }
      />
      {/* main */}
      <div className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-3">
          {customMessages.map((item) => (
            <li key={item._id}>
              <MessageCard message={item} />
            </li>
          ))}
        </ul>
        <div ref={bottomRef}></div>
      </div>
      <ChatInput />
    </div>
  );
};

export default ChatIdPage;
