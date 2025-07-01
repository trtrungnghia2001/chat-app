import type { IUser } from "@/features/auth/types/auth";

export interface IMessage {
  _id: string;
  content: string;
  media: string;
  sender: IUser;
  isRead: boolean;
  room: IRoom;
  createdAt: string;
  updatedAt: string;
}

export interface IRoom {
  _id: string;
  roomName: string;
  users: IUser[];
  isRoom: boolean;
  lastMessage: IMessage;
  admin: IUser;
  createdAt: string;
  updatedAt: string;
}

export interface IMessageSend {
  data: {
    to: string; // userId or roomId
    content: string;
    media: string;
  };
  type: string;
}

export interface IChat {
  id: string;
  type: string; // user or room
}

export interface IChatUser extends IUser {
  lastMessage: IMessage;
}
