import axios from 'axios';
import { AxiosResponse } from 'axios';

export const createRoom = async (param: CreateRoomRequest) => {
  return axios
    .post(`/dm/room/create`, param)
    .then((response) => {
      const { data } = response.data;
      return data as ApiResponse<CreateRoomResponse>;
    })
    .catch((error) => {
      console.error(error);
    });
};

// 현재 채팅방 목록을 가져옴
export const fetchRoomList = async (userId: string): Promise<any> => {
  try {
    const response = await axios.post(`/dm/roomList`, { userId: userId });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 스크롤시 채팅방의 이전 채팅 데이터를 가져옴
export const fetchChatting = (param: FetchChattingRequest) => {
  const { roomId, cursor } = param;
  return axios
    .get(`/dm/room?room_id=${roomId}&cursor=${cursor}`)
    .then((response) => {
      const { data } = response.data;
      return data as ApiResponse<Array<ChatDto>>;
    })
    .catch((error) => {
      console.error(error);
    });
};

interface Response<T> {
  data: T;
  count?: number;
  msg?: string;
}
export type ApiResponse<T> = AxiosResponse<Response<T>>;

// 플레이어에게 매핑되는 유저 정보 타입
export interface UserResponseDto {
  userId: string;
  username: string;
}
// 채팅방 만들기 요청
export interface CreateRoomRequest {
  myId?: number;
}
// 서버에서 채팅방 정보 가져옴
export interface CreateRoomResponse {
  roomId: number;
  lastChat: string;
}

export interface RoomListResponse {
  _id: string;
  myInfo: UserResponseDto;
  receiverInfo: UserResponseDto;
  message: string;
  roomId: string;
  updatedAt: Date | null;
}

// 서버에 채팅 가져오기
// cursor를 기준으로 채팅을 가져온다
export interface FetchChattingRequest {
  roomId: number;
  cursor: number | null;
}

// 채팅룸
export interface ChatDto {
  id: number | string;
  message: string;
  roomId?: number | string;
  sendUserId?: number | string;
  createdAt?: Date;
}
