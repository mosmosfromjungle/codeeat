import { Schema, ArraySchema, SetSchema, MapSchema } from '@colyseus/schema'

export interface IPlayer extends Schema {
  userId: string
  username: string
  userlevel: number
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

export interface ITypingGame extends Schema {
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
  typinggames: MapSchema<ITypingGame>
  chatMessages: ArraySchema<IChatMessage>
}

// export interface IGameState extends Schema {
//   players: MapSchema<IPlayer>
// }
