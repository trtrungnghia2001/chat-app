import { messageModel, roomModel } from "#server/models/chat.model";
import userModel from "#server/models/user.model";
import {
  handleResponse,
  handleResponseList,
  resultAndPagination,
} from "#server/utils/response.util";
import express from "express";
import { StatusCodes } from "http-status-codes";

const chatRouter = express.Router();

// message
chatRouter.post(`/message/send-user`, async (req, res, next) => {
  try {
    const body = req.body; // to,  content, media
    const user = req.user;
    const type = req.query._type; // room or user

    let room;

    // check room
    if (type === "room") {
      room = await roomModel.findById(body.to);
    }

    // check room, if null create new room
    if (type === "user") {
      room = await roomModel.findOne({
        users: {
          $all: [user._id, body.to],
          $size: 2,
        },
      });
      if (!room) {
        room = await roomModel.create({
          roomName: "Private Chat",
          users: [user._id, body.to],
          isRoom: false,
        });
      }
    }

    // if room not found
    if (!room) {
      return handleResponse(res, {
        status: StatusCodes.NOT_FOUND,
        message: "Room not found",
      });
    }

    const message = await messageModel.create({
      ...body,
      sender: user._id,
      room: room._id,
    });

    // update room last message
    if (message) {
      room.lastMessage = message._id;
      await room.save();
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
chatRouter.get(`/get-message/:roomId`, async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const filter = {
      room: roomId,
    };
    const messages = await resultAndPagination(req, messageModel, filter);

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
    const users = await resultAndPagination(req, userModel);

    return handleResponseList(res, {
      status: StatusCodes.OK,
      data: users.data,
      pagination: users.pagination,
    });
  } catch (error) {
    next(error);
  }
});
// room
chatRouter.get(`/room/get-all`, async (req, res, next) => {
  try {
    const rooms = await resultAndPagination(req, roomModel);

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
    const room = await roomModel.findByIdAndDelete(id, { new: true });
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

    const room = await roomModel.create({ ...body, admin: [user._id] });

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
    const room = await roomModel.findByIdAndDelete(id, { new: true });
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
    const room = await roomModel.findByIdAndDelete(id, { new: true });
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
export default chatRouter;
