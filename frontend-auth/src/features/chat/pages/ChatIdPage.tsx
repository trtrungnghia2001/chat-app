import useSearchParamsValue from "@/shared/hooks/useSearchParamsValue";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getMessagesIdApi, getUserIdApi } from "../apis/chatApi";
import { IMAGE_NOTFOUND } from "@/shared/constants/image.constanr";
import { useChatContext } from "../contexts/chat";
import clsx from "clsx";
import ChatInput from "../components/ChatInput";
import { useEffect, useMemo, useRef } from "react";
import MessageCard from "../components/MessageCard";

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
      return null;
    },
    enabled: !!(type && id),
  });
  const infoData = getInfoIdResult.data?.data;

  const { onlineUsers, messages, setCurrentId } = useChatContext();
  const isOnline = onlineUsers.includes(id!);
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
      <div className="flex items-center justify-between border-b p-3">
        {/* left */}
        <div>
          <div className="flex items-center gap-2">
            <div className={`relative`}>
              <div className="w-8 aspect-square overflow-hidden rounded-full">
                <img
                  src={infoData?.avatar || IMAGE_NOTFOUND.avatar_notfound}
                  alt="avatar"
                  loading="lazy"
                />
              </div>
              {isOnline && (
                <div className="absolute bottom-0 right-0 bg-white rounded-full overflow-hidden p-0.5">
                  <div className="w-2 aspect-square bg-green-500 rounded-full overflow-hidden"></div>
                </div>
              )}
            </div>
            <div>
              <h6 className="font-medium text-15">{infoData?.name}</h6>
              <p
                className={clsx([
                  `text-10 font-medium `,
                  isOnline ? "text-green-500" : "text-gray-500",
                ])}
              >
                {isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        </div>
        {/* right */}
        <div></div>
      </div>
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
