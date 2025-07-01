import { MdSend } from "react-icons/md";
import { useChatContext } from "../contexts/chat";
import { useMutation } from "@tanstack/react-query";
import { sendMessageApi } from "../apis/chatApi";
import useSearchParamsValue from "@/shared/hooks/useSearchParamsValue";
import { useState, type ChangeEvent } from "react";
const ChatInput = () => {
  const { searchParams } = useSearchParamsValue();
  const type = searchParams.get("type");
  const [content, setContent] = useState("");

  const { currentId, setMessages } = useChatContext();

  const sendResult = useMutation({
    mutationFn: async () =>
      await sendMessageApi({
        type: type!,
        data: {
          to: currentId!,
          content: content,
          media: "",
        },
      }),
    onSuccess(data) {
      setContent("");
      setMessages((prev) => [...prev, data.data]);
    },
    onError(error) {
      console.error(error);
    },
  });

  const onsubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sendResult.isPending || !content) return;

    sendResult.mutate();
  };

  return (
    <div className="p-3 bg-gray-200 flex items-center gap-3 text-gray-500">
      <form onSubmit={onsubmit} className="flex-1">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          type="text"
          className="outline-none border-none w-full py-1.5 px-3 rounded-full overflow-hidden text-black"
          placeholder="Type your message here..."
        />
      </form>
      <button disabled={sendResult.isPending}>
        <MdSend size={20} />
      </button>
    </div>
  );
};

export default ChatInput;
