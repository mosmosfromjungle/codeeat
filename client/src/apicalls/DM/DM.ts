import axios from 'axios';
import { AxiosResponse } from 'axios';
import phaserGame from '../../PhaserGame';
import Game from '../../scenes/Game'

export const createRoom = async (param: CreateRoomRequest) => {
  return axios
    .post(`/dm/room/create`, param)
    .then((response) => {
      console.log('대화방생성',response.data)
      const { data } = response.data;
      return data as ApiResponse<CreateRoomResponse>;
    })
    .catch((error) => {
      console.error(error);
    });
};

export const DMReq = async (body: any) => {
  try{
    await axios.post(`/dm/newdm`, body)
  } catch(err) {
    console.error(err)
  }
}

export const checkIfFirst = async (body: any) => {
  try{
    const response = axios.post(`/lastdm/checkIfFirst`, body)
    return response;
  } catch(err) {
    console.error(err)
  }
}

// 현재 채팅방 목록을 가져옴
export const fetchRoomList = async (userName: string): Promise<any> => {
  try {
    const response = await axios.post(`/lastdm/roomList`, {senderName : userName} );
    return response.data.payload;
  } catch (error) {
    console.error(error);
  }
};

interface Response<T> {
  data: T;
  count?: number;
  msg?: string;
}
export type ApiResponse<T> = AxiosResponse<Response<T>>;

export interface UserResponseDto {
  userId: string;
  userName: string;
}
export interface CreateRoomRequest {
  myId?: string;
}
export interface CreateRoomResponse {
  roomId: number;
  lastChat: string;
}
export interface RoomListResponse {
  _id: string;
  senderName: string;
  receiverName: string;
  message: string;
  roomId: string;
  updatedAt: Date | null;
}
export interface FetchChattingRequest {
  roomId: number;
  cursor: number | null;
}
