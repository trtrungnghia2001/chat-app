import { create } from "zustand";
import type { IRoom } from "../types";
import type {
  ResponseSuccessListType,
  ResponseSuccessType,
} from "@/shared/types/response";
import {
  createRoomApi,
  deleteRoomIdApi,
  getRoomIdApi,
  getRoomsApi,
  joinRoomIdApi,
  updateRoomIdApi,
} from "../apis/chatApi";

interface IRoomStore {
  rooms: IRoom[];
  create: (data: Partial<IRoom>) => Promise<ResponseSuccessType<IRoom>>;
  updateId: (
    id: string,
    data: Partial<IRoom>
  ) => Promise<ResponseSuccessType<IRoom>>;
  deleteId: (id: string) => Promise<ResponseSuccessType<IRoom>>;
  getAll: () => Promise<ResponseSuccessListType<IRoom>>;
  getId: (id: string) => Promise<ResponseSuccessType<IRoom>>;
  joinRoom: (roomId: string) => Promise<ResponseSuccessType<IRoom>>;
}

export const useRoomStore = create<IRoomStore>((set, get) => ({
  rooms: [],
  create: async (data) => {
    const resp = await createRoomApi(data);
    set({
      rooms: [resp.data, ...get().rooms],
    });

    return resp;
  },
  updateId: async (id, data) => {
    const resp = await updateRoomIdApi(id, data);
    set({
      rooms: get().rooms.map((room) =>
        room._id === id ? { ...room, ...resp.data } : room
      ),
    });

    return resp;
  },
  deleteId: async (id) => {
    const resp = await deleteRoomIdApi(id);
    set({
      rooms: get().rooms.filter((room) => room._id !== resp.data._id),
    });

    return resp;
  },
  getAll: async () => {
    const resp = await getRoomsApi();
    set({
      rooms: resp.data,
    });

    return resp;
  },
  getId: async (id) => {
    const resp = await getRoomIdApi(id);

    return resp;
  },
  joinRoom: async (roomId) => {
    const resp = await joinRoomIdApi(roomId);
    set({
      rooms: [resp.data, ...get().rooms],
    });

    return resp;
  },
}));
