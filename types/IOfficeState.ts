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
  rainGameStates : MapSchema<IRainGameState>
}

export interface IRainGameUser extends Schema {
  name: string;
  anim: string;
}

export interface IKeywordRain extends Schema {
  owner: string,
  y: number,
  speed: number,
  keyword: string,
  x: number,
  flicker: boolean,
  blind: boolean,
  accel: boolean,
  multifly: boolean,
}

export interface IRainGameState extends Schema {
  owner: string,
  rainGameOpen: boolean,
  item: string[],
  point: number,
  heart: number,
  period: number,
  words: ArraySchema<IKeywordRain>
}




// export interface IGameState extends Schema {
//   players: MapSchema<IPlayer>
  // molegames: MapSchema<IMoleGame>
  // brickgames: MapSchema<IBrickGame>
  // typinggames: MapSchema<ITypingGame>
// }
