import { Schema, ArraySchema, SetSchema, MapSchema } from '@colyseus/schema'

export interface IPlayer extends Schema {
  name: string
  x: number
  y: number
  anim: string
  readyToConnect: boolean
  videoConnected: boolean
}

export interface IBrickGame extends Schema {
  // roomId: string
  connectedUser: SetSchema<string>
}

export interface IMoleGame extends Schema {
  // roomId: string
  connectedUser: SetSchema<string>
}

export interface IRainGame extends Schema {
  // roomId: string
  connectedUser: SetSchema<string>
}

export interface IChatMessage extends Schema {
  author: string
  createdAt: number
  content: string
}

export interface IOfficeState extends Schema {
  players: MapSchema<IPlayer>
  molegames: MapSchema<IMoleGame>
  brickgames: MapSchema<IBrickGame>
  raingames: MapSchema<IRainGame>
  chatMessages: ArraySchema<IChatMessage>
}

export interface IRainGameUser {
  name: string;
  anim: string;
}

export interface IKeywordRain {
  y: number,
  speed: number,
  keyword: string,
  x: number,
  flicker: boolean,
  blind: boolean,
  accel: boolean,
  multifly: boolean,
}

export interface IRainGameState {
  rainGameOpen: boolean,
  game: IKeywordRain[],
  point: number,
  heart: number,
  keywordList: string[],
  period: number
}




// export interface IGameState extends Schema {
//   players: MapSchema<IPlayer>
  // molegames: MapSchema<IMoleGame>
  // brickgames: MapSchema<IBrickGame>
  // typinggames: MapSchema<ITypingGame>
// }
