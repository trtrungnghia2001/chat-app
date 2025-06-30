import SidebarLeft from "../components/SidebarLeft";
import { Outlet } from "react-router-dom";

const ChatPage = () => {
  return (
    <div className="flex">
      <SidebarLeft />
      <section className="flex-1">
        <Outlet />
      </section>
    </div>
  );
};

export default ChatPage;
