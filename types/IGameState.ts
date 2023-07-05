import { Schema, MapSchema, ArraySchema } from '@colyseus/schema'

/* MOLE GAME ROOM SCHEMA */

/* RAIN GAME ROOM SCHEMA */

export interface IKeywordRain extends Schema {
  y: number
  speed: number
  keyword: string
  x: number
  itemA: boolean
  itemB: boolean
}

export interface IRainGameUser extends Schema {
  username: string
  character: string
}

export interface IRainGameState extends Schema {
  point: number
  heart: number
  item: string[]
}

export interface IRainGameRoomState extends Schema {
  host: string
  rainGameReady: boolean
  rainGameInProgress: boolean
  rainGameStates: MapSchema<IRainGameState>
  rainGameUsers: MapSchema<IRainGameUser>
  keywordLists: MapSchema<IKeywordRain>
  winner: string
}

/* BRICK GAME ROOM SCHEMA */

export interface IImageContainer extends Schema {
  imgidx: number
  text: string
}

export interface IBrickPlayerStatus extends Schema {
  currentImages: ArraySchema<IImageContainer>
  selectedOption: DATA_STRUCTURE
  commandArray: ArraySchema<string>
}

export interface IBrickPlayerScore extends Schema {
  pointArray: ArraySchema<number>
  totalPoint: number
  chance: number
}

export interface IBrickPlayer extends Schema {
  playerScore: IBrickPlayerScore
  playerStatus: IBrickPlayerStatus
}

export interface IBrickGameState extends Schema {
  brickPlayers: MapSchema<IBrickPlayer>
  problemId: number
  problemType: QUIZ_TYPE
  problemImages: ArraySchema<IImageContainer>
  gameInProgress: boolean
  gameStarting: boolean
  currentRound: number
  hasRoundWinner: boolean
  roundWinner: string
}

/* GAME ROOM SCHEMA */

export interface IGamePlayer extends Schema {
  username: string
  character: string
}

export interface IGameState extends Schema {
  players: MapSchema<IGamePlayer>
  host: string  // username of the player that created the room
  brickgames: IBrickGameState
  raingames: IRainGameRoomState
}

/* ENUMS */

export enum DATA_STRUCTURE {
  NONE = 'none',
  LIST = 'list',
  SET = 'set',
  STACK = 'stack',
  QUEUE = 'queue',
  DEQUE = 'deque',
}

export enum QUIZ_TYPE {
  NONE = 'none',
  SAME2 = 'same2',
  SAME3 = 'same3',
  DIFF3 = 'diff3',
}
