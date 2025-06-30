import { useAuthStore } from "@/features/auth/stores/auth.store";
import type { IMessage } from "../types";
import clsx from "clsx";
import { IMAGE_NOTFOUND } from "@/shared/constants/image.constanr";

const MessageCard = ({ message }: { message: IMessage }) => {
  const { user } = useAuthStore();
  return (
    <div
      className={clsx([
        `flex `,
        user?._id !== message.sender._id ? `justify-start` : `justify-end`,
      ])}
    >
      <div className="flex items-end gap-2 max-w-[50%]">
        {user?._id !== message.sender._id && (
          <div className="w-6 aspect-square overflow-hidden rounded-full">
            <img
              src={message.sender.avatar || IMAGE_NOTFOUND.avatar_notfound}
              alt="avatar"
              loading="lazy"
            />
          </div>
        )}
        <div
          dangerouslySetInnerHTML={{ __html: message.content }}
          className={clsx([
            `px-3 py-1.5 rounded-full`,
            user?._id !== message.sender._id
              ? `bg-gray-100`
              : `bg-blue-500 text-white`,
          ])}
        ></div>
      </div>
    </div>
  );
};

export default MessageCard;
