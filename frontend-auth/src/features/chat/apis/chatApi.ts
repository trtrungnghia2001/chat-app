import type { IUser } from "@/features/auth/types/auth";
import instance from "@/shared/configs/axios.config";
import type {
  ResponseSuccessListType,
  ResponseSuccessType,
} from "@/shared/types/response";
import type { IMessage, IMessageSend, IRoom } from "../types";

const baseUrl: string = `/api/v1/chat`;

export async function sendMessageApi(data: IMessageSend) {
  const url = baseUrl + `/message/send-message`;
  return (
    await instance.post<ResponseSuccessType<IMessage>>(url, data.data, {
      params: { _type: data.type },
    })
  ).data;
}
export async function getMessagesIdApi(id: string, type: string) {
  const url = baseUrl + `/message/get-all/` + id;
  return (
    await instance.get<ResponseSuccessListType<IMessage>>(url, {
      params: { _type: type },
    })
  ).data;
}

export async function getUsersApi() {
  const url = baseUrl + `/user/get-all`;
  return (await instance.get<ResponseSuccessListType<IUser>>(url)).data;
}
export async function getUserIdApi(id: string) {
  const url = baseUrl + `/user/get-id/` + id;
  return (await instance.get<ResponseSuccessType<IUser>>(url)).data;
}
export async function getRoomsApi() {
  const url = baseUrl + `/room/get-all`;
  return (await instance.get<ResponseSuccessListType<IRoom>>(url)).data;
}
export async function getRoomIdApi(id: string) {
  const url = baseUrl + `/room/get-id/` + id;
  return (await instance.get<ResponseSuccessType<IRoom>>(url)).data;
}
