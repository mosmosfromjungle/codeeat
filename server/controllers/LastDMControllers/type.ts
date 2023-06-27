import { Schema } from "mongoose"
export type Token = string

export interface ILastDM {
  senderInfo: UserResponseDto
  receiverInfo: UserResponseDto
  message: string
  roomId?: string
  updatedAt: Date | null
}

export interface UserResponseDto {
  userId: string
  userName: string
}