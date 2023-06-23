export enum RoomType {
  LOBBY = 'lobby',
  PUBLIC = 'skyoffice',
  CUSTOM = 'custom',

  BRICKLOBBY = 'brick_lobby',
  MOLELOBBY = 'mole_lobby',
  TYPINGLOBBY = 'typing_lobby',
  
  MOLE = 'whackamole',
  BRICK = 'bricks',
  TYPING = 'acidrain',
}

export interface IRoomData {
  name: string
  description: string
  password: string | null
  autoDispose: boolean
}
