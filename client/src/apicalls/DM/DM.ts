import axios from 'axios';
import { AxiosResponse } from 'axios';
import phaserGame from '../../PhaserGame';
import Game from '../../scenes/Game'

export const checkIfFirst = async (body: {senderName: string; receiverName: string}) => {
  try{
    const response = axios.post(`/lastdm/checkIfFirst`, body)
    console.log(body)
    return response;
  } catch(err) {
    console.error(err)
  }
}

// 현재 채팅방 목록을 가져옴
export const fetchRoomList = async (username: string): Promise<any> => {
  try {
    const response = await axios.post(`/lastdm/roomList`, {senderName : username} );
    return response.data.payload;
  } catch (error) {
    console.error(error);
  }
};
export const getRoomId = async (body: {myName: string, targetName: string}) => {
  try {
    const response = await axios.post(`/lastdm/getRoom`, body);
    return response.data;
  } catch(err) {
    console.error(err)
  }
}

interface Response<T> {
  data: T;
  count?: number;
  msg?: string;
}
export type ApiResponse<T> = AxiosResponse<Response<T>>;
export interface RoomListResponse {
  _id: string;
  senderName: string;
  receiverName: string;
  message: string;
  roomId: string;
  unreadCount?: number;
  updatedAt: Date | null;
}