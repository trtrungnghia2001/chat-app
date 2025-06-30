import { useChatContext } from "../contexts/chat";
import { useQuery } from "@tanstack/react-query";
import { getRoomsApi, getUsersApi } from "../apis/chatApi";
import { IMAGE_NOTFOUND } from "@/shared/constants/image.constanr";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { useEffect } from "react";

const SidebarLeft = () => {
  const { onlineUsers, setChats } = useChatContext();
  const getRoomsAndUsersResult = useQuery({
    queryKey: ["get", "rooms", "users"],
    queryFn: async () => {
      const [users, rooms] = await Promise.all([getUsersApi(), getRoomsApi()]);
      return { users, rooms };
    },
  });
  console.log(getRoomsAndUsersResult.data);

  useEffect(() => {
    if (getRoomsAndUsersResult.data) {
      const newChats = getRoomsAndUsersResult.data.users.data.map(
        (item) => item._id
      );
      setChats(newChats);
    }
  }, [getRoomsAndUsersResult.data]);

  //   const

  return (
    <aside className="w-64 border-r h-screen overflow-y-auto p-3">
      {/*  */}
      <h5 className="font-medium text-gray-500 mb-2">Users</h5>
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
              </div>
            </NavLink>
          </li>
        ))}
      </ul>
      {/*  */}
      <h5 className="font-medium text-gray-500 mb-4">Rooms</h5>
    </aside>
  );
};

export default SidebarLeft;
