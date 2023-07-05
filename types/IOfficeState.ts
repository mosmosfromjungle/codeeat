import { Schema, ArraySchema, SetSchema, MapSchema } from '@colyseus/schema'

export interface IPlayer extends Schema {
  name: string
  x: number
  y: number
  anim: string
}

// export interface IBrickGame extends Schema {
//   // roomId: string
//   connectedUser: SetSchema<string>
// }

// export interface IMoleGame extends Schema {
//   // roomId: string
//   connectedUser: SetSchema<string>
// }

// export interface IRainGame extends Schema {
//   // roomId: string
//   connectedUser: SetSchema<string>
// }

export interface IChatMessage extends Schema {
  author: string
  createdAt: number
  content: string
}

export interface IOfficeState extends Schema {
  players: MapSchema<IPlayer>
  chatMessages: ArraySchema<IChatMessage>
  // molegames: MapSchema<IMoleGame>
  // brickgames: MapSchema<IBrickGame>
  // raingames: MapSchema<IRainGame>
  // rainGameStates : MapSchema<IRainGameState>
}

export interface IDMState extends Schema {
  users: MapSchema<IPlayer[]>
  roomId: string
}