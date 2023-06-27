import { Schema, MapSchema, ArraySchema } from '@colyseus/schema'


/* MOLE GAME ROOM SCHEMA */


/* RAIN GAME ROOM SCHEMA */


/* BRICK GAME ROOM SCHEMA */

export interface IBrickPlayerScore extends Schema {
  pointArray: ArraySchema<number>
  totalPoint: number
}

export interface IImageContainer extends Schema {
  imgidx: number
  text: string
}

export interface IBrickPlayerStatus extends Schema {
  currentImages: ArraySchema<IImageContainer>
  selectedOption: DATA_STRUCTURE
  commandArray: ArraySchema<string>
}

export interface IBrickPlayer extends Schema {
  // name: string
  playerScore: IBrickPlayerScore
  playerStatus: IBrickPlayerStatus
}

export interface IBrickGameState extends Schema {
  brickPlayers: MapSchema<IBrickPlayer>
  currentQuiz: QUIZ_TYPE
  originalImages: ArraySchema<IImageContainer>
  gameInProgress: boolean
  gameStarting: boolean
}


/* GAME ROOM SCHEMA */

export interface IGamePlayer extends Schema {
  name: string
  // anim: string
}

export interface IGameState extends Schema {
  players: MapSchema<IGamePlayer>
  // molegames: 
  // raingames:
  brickgames: IBrickGameState
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
  NONE = '',
  WAIT = '이번 문제는!?',
  SAME2 = '같은 동물 2마리만 남겨주세요',
  SAME3 = '같은 동물 3마리만 남겨주세요',
  DIFF2 = '서로 다른 2종류의 동물만 남겨주세요',
  DIFF3 = '서로 다른 3종류의 동물만 남겨주세요',
}
