export enum RoomType {
  LOBBY = 'lobby',
  PUBLIC = 'skyoffice',
}

export interface IRoomData {
  name: string
  description: string
  password: string | null
  autoDispose: boolean
}
