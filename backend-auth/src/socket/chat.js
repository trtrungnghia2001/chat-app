import { io } from "#server/configs/socket.config";

export const onlineUserMap = new Map();

export async function connectSocketIo() {
  io.on("connection", function (socket) {
    // connect and disconnect
    console.log(`Soket connection:: `, socket.id);

    // kiem tra da co dang nhap chua
    const authId = socket.handshake.auth.authId;
    if (!authId) {
      console.log("AuthId not found!");
      socket.disconnect();
      return;
    }
    onlineUserMap.set(authId, socket.id);

    socket.on("disconnect", function () {
      console.log(`Soket disconnect:: `, socket.id);
      onlineUserMap.delete(authId);

      // cap nhat lai user dang online
      io.emit("onlineUsers", Array.from(onlineUserMap.keys()));
    });

    // gui user dang online
    io.emit("onlineUsers", Array.from(onlineUserMap.keys()));

    // join tat ca cac room cua user
    socket.on("join-rooms", (values) => {
      values.forEach((item) => {
        if (item.type === "user") {
          const roomID = createRoomId(authId, item.id);
          socket.join(roomID);
        } else if (item.type === "room") {
          socket.join("-" + item.id);
        }
      });
      console.log(socket.rooms);
    });

    socket.on("join-room", (value) => {
      if (value.type === "user") {
        const roomID = createRoomId(authId, value.id);
        socket.join(roomID);
      } else if (value.type === "room") {
        socket.join("-" + value.id);
      }
    });
  });
}

export function createRoomId(id1, id2) {
  return [id1, id2].sort().join("-");
}
export function sendMessageWithSocket(id1, id2, data) {
  const roomId = createRoomId(id1, id2);

  io.to(roomId).emit("send-message", data);
}
export function joinRoomWithSocket(id1, id2, data) {
  const roomId = createRoomId(id1, id2);

  io.to(roomId).emit("join-room", data);
}
