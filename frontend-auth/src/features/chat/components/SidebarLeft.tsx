import { useChatContext } from "../contexts/chat";
import { useQuery } from "@tanstack/react-query";
import { getRoomsApi, getUsersApi } from "../apis/chatApi";
import { IMAGE_NOTFOUND } from "@/shared/constants/image.constanr";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { useEffect } from "react";
import { MdAdd, MdSearch } from "react-icons/md";
import RoomForm from "./RoomForm";
import { useRoomStore } from "../stores/room";
import RoomJoinForm from "./RoomJoinForm";

const SidebarLeft = () => {
  const { onlineUsers, setChats } = useChatContext();
  const { rooms, getAll } = useRoomStore();
  const getRoomsResult = useQuery({
    queryKey: ["get", "room"],
    queryFn: async () => await getAll(),
  });

  const getRoomsAndUsersResult = useQuery({
    queryKey: ["get", "users"],
    queryFn: async () => {
      const [users, rooms] = await Promise.all([getUsersApi(), getRoomsApi()]);
      return { users, rooms };
    },
  });

  useEffect(() => {
    if (getRoomsAndUsersResult.data) {
      const newChats = getRoomsAndUsersResult.data.users.data
        .map((item) => ({
          id: item._id,
          type: "user",
        }))
        .concat(
          rooms.map((item) => ({
            id: item._id,
            type: "room",
          }))
        );

      setChats([...newChats]);
    }
  }, [getRoomsAndUsersResult.data, rooms]);

  //   const

  return (
    <aside className="w-64 border-r h-screen overflow-y-auto p-3">
      {/* <form className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="border px-3 py-1 rounded-full w-full outline-none focus:ring-blue-500 focus:ring-1"
        />
      </form> */}
      {/*  */}
      <h5 className="font-medium text-gray-500 mb-4">Users</h5>
      <ul className="space-y-2 mb-8">
        {getRoomsAndUsersResult.data?.users?.data.map((item) => (
          <li key={item._id}>
            <NavLink
              to={`/chat/` + item._id + "?type=user"}
              className={({ isActive }) =>
                clsx([
                  `flex items-center gap-2 hover:bg-gray-100 px-3 py-1.5 rounded-lg`,
                  isActive && `bg-gray-100`,
                ])
              }
            >
              <div className={`relative`}>
                <div className="w-8 aspect-square overflow-hidden rounded-full">
                  <img
                    src={item.avatar || IMAGE_NOTFOUND.avatar_notfound}
                    alt="avatar"
                    loading="lazy"
                  />
                </div>
                {onlineUsers.includes(item._id) && (
                  <div className="absolute bottom-0 right-0 bg-white rounded-full overflow-hidden p-0.5">
                    <div className="w-2 aspect-square bg-green-500 rounded-full overflow-hidden"></div>
                  </div>
                )}
              </div>
              <div>
                <h6 className="font-medium text-15">{item.name}</h6>
                {/* <p className="text-gray-500 text-xs line-clamp-1">
                  <span className="font-medium">
                    {item.lastMessage.sender.name}:
                  </span>{" "}
                  {item.lastMessage.content}
                </p> */}
              </div>
            </NavLink>
          </li>
        ))}
      </ul>
      {/*  */}
      <div className="flex items-center justify-between mb-4 text-gray-500">
        <h5 className="font-medium ">Rooms</h5>
        <ul>
          <li className="flex items-center gap-2">
            <RoomForm>
              <MdAdd size={18} />
            </RoomForm>
            <RoomJoinForm>
              <MdSearch size={18} />
            </RoomJoinForm>
          </li>
        </ul>
      </div>
      <ul className="space-y-2">
        {rooms.map((item) => (
          <li key={item._id}>
            <NavLink
              to={`/chat/` + item._id + "?type=room"}
              className={({ isActive }) =>
                clsx([
                  `flex items-center gap-2 hover:bg-gray-100 px-3 py-1.5 rounded-lg`,
                  isActive && `bg-gray-100`,
                ])
              }
            >
              <div className="font-medium">{item.roomName}</div>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default SidebarLeft;
