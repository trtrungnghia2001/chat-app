import { messageModel, roomModel } from "#server/models/chat.model";
import userModel from "#server/models/user.model";
import { joinRoomWithSocket, sendMessageWithSocket } from "#server/socket/chat";
import {
  handleResponse,
  handleResponseList,
  resultAndPagination,
} from "#server/utils/response.util";
import express from "express";
import { StatusCodes } from "http-status-codes";

const chatRouter = express.Router();

// message
chatRouter.post(`/message/send-message`, async (req, res, next) => {
  try {
    const body = req.body; // to,  content, media
    const user = req.user;
    const type = req.query._type; // room or user

    let room;

    // check room
    if (type === "room") {
      room = await roomModel.findById(body.to);

      if (!room) {
        return handleResponse(res, {
          status: StatusCodes.NOT_FOUND,
          message: "Room not found",
        });
      }
    }

    // check room, if null create new room
    if (type === "user") {
      room = await roomModel.findOne({
        users: {
          $all: [user._id, body.to],
          $size: 2,
        },
        isGroup: false,
      });

      if (!room) {
        room = await roomModel.create({
          roomName: "Private Chat",
          users: [user._id, body.to],
          isGroup: false,
        });
      }
    }

    const newMessage = await messageModel.create({
      ...body,
      sender: user._id,
      room: room._id,
    });

    // update room last message
    if (newMessage) {
      room.lastMessage = newMessage._id;
      await room.save();
    }

    const message = await messageModel
      .findById(newMessage._id)
      .populate([`sender`, `room`]);

    if (type === "user") {
      sendMessageWithSocket(user._id, body.to, message);
    } else if (type === "room") {
      sendMessageWithSocket("", body.to, message);
    }

    return handleResponse(res, {
      status: StatusCodes.CREATED,
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    next(error);
  }
});
chatRouter.get(`/message/get-all/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const type = req.query._type; // room or user

    let room;
    // check room
    if (type === "room") {
      room = await roomModel.findById(id);
    }

    // check room, if null create new room
    if (type === "user") {
      room = await roomModel.findOne({
        users: {
          $all: [user._id, id],
          $size: 2,
        },
        isGroup: false,
      });
    }

    if (!room) {
      return handleResponse(res, {
        status: StatusCodes.NOT_FOUND,
        message: "Room not found",
      });
    }

    const filter = {
      room: room._id,
    };

    const options = {
      populate: [`sender`],
    };

    const messages = await resultAndPagination(
      req,
      messageModel,
      filter,
      options
    );

    return handleResponseList(res, {
      status: StatusCodes.OK,
      data: messages.data,
      pagination: messages.pagination,
    });
  } catch (error) {
    next(error);
  }
});

// user
chatRouter.get(`/user/get-all`, async (req, res, next) => {
  try {
    const users = await resultAndPagination(req, userModel, {
      _id: {
        $ne: req.user._id,
      },
    });

    // const options = {
    //   populate: [
    //     {
    //       path: `lastMessage`,
    //       populate: [`sender`],
    //     },
    //   ],
    // };

    // const rooms = await resultAndPagination(req, roomModel, {}, options);

    // const data = users.data.map((user) => ({
    //   ...user._doc,
    //   lastMessage: rooms.data?.find((room) => room?.users?.includes(user._id))
    //     ?.lastMessage,
    // }));

    return handleResponseList(res, {
      status: StatusCodes.OK,
      data: users.data,
      pagination: users.pagination,
    });
  } catch (error) {
    next(error);
  }
});
chatRouter.get(`/user/get-id/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);
    if (!user) {
      return handleResponse(res, {
        status: StatusCodes.NOT_FOUND,
        message: "User not found",
      });
    }
    return handleResponse(res, {
      status: StatusCodes.OK,
      message: "User found successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
});
// room
chatRouter.get(`/room/get-all`, async (req, res, next) => {
  try {
    const filter = {
      isGroup: true,
      users: req.user._id,
    };

    const rooms = await resultAndPagination(req, roomModel, filter);

    return handleResponseList(res, {
      status: StatusCodes.OK,
      data: rooms.data,
      pagination: rooms.pagination,
    });
  } catch (error) {
    next(error);
  }
});
chatRouter.get(`/room/get-id/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const room = await roomModel.findById(id);
    if (!room) {
      return handleResponse(res, {
        status: StatusCodes.NOT_FOUND,
        message: "Room not found",
      });
    }
    return handleResponse(res, {
      status: StatusCodes.OK,
      message: "Room found successfully",
      data: room,
    });
  } catch (error) {
    next(error);
  }
});
chatRouter.post(`/room/create`, async (req, res, next) => {
  try {
    const body = req.body;

    const user = req.user;

    const room = await roomModel.create({
      ...body,
      isGroup: true,
      users: [user._id],
      admin: [user._id],
    });

    return handleResponse(res, {
      status: StatusCodes.CREATED,
      message: "Room created successfully",
      data: room,
    });
  } catch (error) {
    next(error);
  }
});
chatRouter.put(`/room/update/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const room = await roomModel.findById(id);
    if (!room) {
      return handleResponse(res, {
        status: StatusCodes.NOT_FOUND,
        message: "Room not found",
      });
    }

    const updateRoom = await roomModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    return handleResponse(res, {
      status: StatusCodes.OK,
      message: "Room updated successfully",
      data: updateRoom,
    });
  } catch (error) {
    next(error);
  }
});
chatRouter.delete(`/room/delete/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const room = await roomModel.findById(id);
    if (!room) {
      return handleResponse(res, {
        status: StatusCodes.NOT_FOUND,
        message: "Room not found",
      });
    }

    await messageModel.deleteMany({ room: id });

    return handleResponse(res, {
      status: StatusCodes.OK,
      message: "Room deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});
chatRouter.post(`/room/join-room`, async (req, res, next) => {
  try {
    const user = req.user;
    const body = req.body;

    const room = await roomModel.findById(body.roomId);
    if (!room) {
      return handleResponse(res, {
        status: StatusCodes.NOT_FOUND,
        message: "Room not found",
      });
    }

    const updateRoom = await roomModel.findByIdAndUpdate(
      body.roomId,
      {
        $addToSet: {
          users: user._id,
        },
      },
      { new: true }
    );

    joinRoomWithSocket("", room._id, { id: room._id, type: "room" });

    return handleResponse(res, {
      status: StatusCodes.OK,
      message: "Joined room successfully!",
      data: updateRoom,
    });
  } catch (error) {
    next(error);
  }
});
export default chatRouter;
