import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    content: String,
    media: String,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "room",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const messageModel =
  mongoose.models.message || mongoose.model("message", messageSchema);

const roomSchema = new mongoose.Schema(
  {
    roomName: {
      type: String,
      required: true,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
    ],
    isGroup: {
      type: Boolean,
      default: false,
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "message",
    },
    admin: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const roomModel = mongoose.models.room || mongoose.model("room", roomSchema);

export { messageModel, roomModel };
