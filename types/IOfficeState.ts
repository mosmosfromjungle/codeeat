import { Schema, ArraySchema, SetSchema, MapSchema } from '@colyseus/schema'

export interface IPlayer extends Schema {
  name: string
  x: number
  y: number
  anim: string
  readyToConnect: boolean
  videoConnected: boolean
}

export interface IComputer extends Schema {
  connectedUser: SetSchema<string>
}

export interface ITypinggame extends Schema {
  roomId: string
  connectedUser: SetSchema<string>
}

export interface IMoleGame extends Schema {
  roomId: string
  connectedUser: SetSchema<string>
}

export interface IChatMessage extends Schema {
  author: string
  createdAt: number
  content: string
}

export interface IOfficeState extends Schema {
  players: MapSchema<IPlayer>
  computers: MapSchema<IComputer>
<<<<<<< HEAD
  typinggames: MapSchema<ITypinggame>
  codeeditors: MapSchema<ICodeEditor>
=======
  whiteboards: MapSchema<IWhiteboard>
  molegames: MapSchema<IMoleGame>
>>>>>>> 48c509604bc502c87a941ca6a921efaf7bc8b6b6
  chatMessages: ArraySchema<IChatMessage>
}
