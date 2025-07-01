import type { IUser } from "@/features/auth/types/auth";
import type { IRoom } from "../types";
import { IMAGE_NOTFOUND } from "@/shared/constants/image.constanr";
import { useChatContext } from "../contexts/chat";
import clsx from "clsx";
import { MdCopyAll } from "react-icons/md";
import { toast } from "sonner";

interface Props {
  user?: IUser;
  room?: IRoom;
}

const ChatHeader = ({ user, room }: Props) => {
  const { onlineUsers } = useChatContext();
  const isOnline = onlineUsers.includes(user?._id as string);

  const handleCopy = async (id: string) => {
    await navigator.clipboard.writeText(id).then(() => {
      toast.success(`Copy code successfully!`);
    });
  };

  return (
    <div className="flex items-center justify-between border-b p-3">
      {/* left */}
      <div>
        {user && (
          <div className="flex items-center gap-2">
            <div className={`relative`}>
              <div className="w-8 aspect-square overflow-hidden rounded-full">
                <img
                  src={user?.avatar || IMAGE_NOTFOUND.avatar_notfound}
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
              <h6 className="font-medium text-15">{user?.name}</h6>
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
        )}
        {room && (
          <div className="space-y-1">
            <h6 className="font-medium text-15">
              {room.roomName} ({room.users.length})
            </h6>
            <p className="text-gray-500 font-medium text-xs italic flex items-center gap-2">
              <span>#{room._id}</span>
              <MdCopyAll
                size={16}
                className="cursor-pointer"
                onClick={() => handleCopy(room._id)}
              />
            </p>
          </div>
        )}
      </div>
      {/* right */}
      <div></div>
    </div>
  );
};

export default ChatHeader;
