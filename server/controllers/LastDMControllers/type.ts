import { Schema } from "mongoose"
export type Token = string

export interface ILastDM {
  myInfo: UserResponseDto
  friendInfo: UserResponseDto
  message: string
  status: IDMRoomStatus
  roomId?: string
  updatedAt: Date | null
}

export interface UserResponseDto {
  userId: string
  username: string
}

export enum IDMRoomStatus {
  FRIEND_REQUEST,
  SOCKET_ON,
  SOCKET_OFF,
  TERMINATED
}
