import { Schema } from "mongoose"
export type Token = string

export interface ILastDM {
  senderName: string
  receiverName: string
  message: string
  roomId?: string
  updatedAt: Date | null
}