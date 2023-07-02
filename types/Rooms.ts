export enum RoomType {
  LOBBY = 'lobby',
  PUBLIC = 'skyoffice',
  CUSTOM = 'custom',

  DM = 'dm',
  BRICKLOBBY = 'brick_lobby',
  MOLELOBBY = 'mole_lobby',
  RAINLOBBY = 'rain_lobby',
  
  MOLE = 'whackamole',
  BRICK = 'bricks',
  RAIN = 'acidrain',
}

export interface IRoomData {
  name: string
  description: string
  password: string | null
  autoDispose: boolean
}

export interface IGameRoomData {
  name: string
  description: string
  password: string | null
  // autoDispose: boolean
  username: string
}
