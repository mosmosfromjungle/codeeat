import axios from 'axios';
import { AxiosResponse } from 'axios';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
// 채팅방 입장 시, 채팅방 정보를 얻음
export const createRoom = (param: CreateRoomRequest) => {
  return axios
    .post(`/DM/room/create`, param)
    .then((response) => {
      const { data } = response.data;
      return data as ApiResponse<CreateRoomResponse>;
    })
    .catch((error) => {
      console.error(error);
    });
};
// 현재 채팅방 목록을 가져옴
export const fetchRoomList = async (userId: string) => {
  try {
    const cookieUserId = cookies.get('userId');
    const response = await axios.post<RoomListResponseWithStatus>(`/DM/roomList`, { userId: userId || cookieUserId });
    return response.data.payload;
  } catch (error) {
    console.error(error);
  }
};

// 스크롤시 채팅방의 채팅 데이터를 가져옴(옛날 채팅 리스트)
export const fetchDM = (param: FetchDMRequest) => {
  const { roomId, cursor } = param;
  return axios
    .get(`/DM/room?room_id=${roomId}&cursor=${cursor}`)
    .then((response) => {
      const { data } = response.data;
      return data as ApiResponse<Array<DMDto>>;
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

interface RoomListResponseWithStatus{
  status: number;
  payload: Array<RoomListResponse>;
}

// 플레이어에게 매핑되는 유저 정보 타입
export interface UserResponseDto {
  userId?: string;
  username?: string;
  height?: string;
  gender?: string;
  weight?: string;
  age?: string;
  statusMessage?: string;
}
export interface IUserProfile {
  height: string;
  weight: string;
  region: string;
  gender: string;
  age: string;
  statusMessage: string;
}

// 채팅방 만들기 요청
export interface CreateRoomRequest {
  myId?: number;
  identifier: string;
  roomName: string;
  participant: Array<UserResponseDto>;
}
// 서버에서 채팅방 정보 가져옴
export interface CreateRoomResponse {
  roomId: number;
  identifier: string;
  roomName: string;
  lastDM: string;
}

export interface RoomListResponse {
  _id: string;
  myInfo: UserResponseDto;
  friendInfo: UserResponseDto;
  message: string;
  status: IDMRoomStatus;
  roomId: string;
  unreadCount: number;
  updatedAt: Date | null;
}

export enum IDMRoomStatus {
  FRIEND_REQUEST,
  SOCKET_ON,
  SOCKET_OFF,
  REJECTED,
  TERMINATED,
}

// 서버에 채팅 가져오기
// cursor를 기준으로 채팅을 가져옵니다.
export interface FetchDMRequest {
  roomId: number;
  cursor: number | null;
}

// 채팅룸
export interface DMDto {
  id: number | string;
  message: string;
  roomId?: number | string;
  sendUserId?: number | string;
  notRead?: number;
  createdAt?: Date;
}

export interface ServerToClientEvents {
  // noArg: () => void;
  start_DM: (dmList: Array<DMDto>) => void;
  DM: (dm: DMDto) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  DM: (dm: DMDto) => void;
  test: (dm: string) => void;
}
