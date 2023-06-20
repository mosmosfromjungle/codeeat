import { Schema, ArraySchema, SetSchema, MapSchema } from '@colyseus/schema'

export interface IPlayer extends Schema {
  name: string
  x: number
  y: number
  anim: string
  readyToConnect: boolean
  videoConnected: boolean
  userId: string
}

export interface IDataStructure extends Schema {
  connectedUser: SetSchema<string>
}

export interface IAcidRain extends Schema {
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
  datastructures: MapSchema<IDataStructure>
  acidrains: MapSchema<IAcidRain>
  molegames: MapSchema<IMoleGame>
  chatMessages: ArraySchema<IChatMessage>
}
