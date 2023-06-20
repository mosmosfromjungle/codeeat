import { Schema, ArraySchema, SetSchema, MapSchema, type } from '@colyseus/schema'
import {
  IPlayer,
  IOfficeState,
  IComputer,
<<<<<<< HEAD
  ITypinggame,
  ICodeEditor,
=======
  IWhiteboard,
  IMoleGame,
>>>>>>> 48c509604bc502c87a941ca6a921efaf7bc8b6b6
  IChatMessage,
} from '../../../types/IOfficeState'

export class Player extends Schema implements IPlayer {
  @type('string') name = ''
  @type('number') x = 705
  @type('number') y = 500
  @type('string') anim = 'adam_idle_down'
  @type('boolean') readyToConnect = false
  @type('boolean') videoConnected = false
}

export class Computer extends Schema implements IComputer {
  @type({ set: 'string' }) connectedUser = new SetSchema<string>()
}

export class Typinggame extends Schema implements ITypinggame {
  @type('string') roomId = getRoomId()
  @type({ set: 'string' }) connectedUser = new SetSchema<string>()
}

export class MoleGame extends Schema implements IMoleGame {
  @type('string') roomId = getRoomId()
  @type({ set: 'string' }) connectedUser = new SetSchema<string>()
}

export class ChatMessage extends Schema implements IChatMessage {
  @type('string') author = ''
  @type('number') createdAt = new Date().getTime()
  @type('string') content = ''
}

export class OfficeState extends Schema implements IOfficeState {
  @type({ map: Player })
  players = new MapSchema<Player>()

  @type({ map: Computer })
  computers = new MapSchema<Computer>()

  @type({ map: Typinggame })
  typinggames = new MapSchema<Typinggame>()

  @type({ map: MoleGame })
  molegames = new MapSchema<MoleGame>()

  @type([ChatMessage])
  chatMessages = new ArraySchema<ChatMessage>()
}

<<<<<<< HEAD
export const typinggameRoomIds = new Set<string>()
export const codeEditorRoomIds = new Set<string>()
=======
export const whiteboardRoomIds = new Set<string>()
export const moleGameRoomIds = new Set<string>()
>>>>>>> 48c509604bc502c87a941ca6a921efaf7bc8b6b6
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const charactersLength = characters.length

function getRoomId() {
  let result = ''
  for (let i = 0; i < 12; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  if (!typinggameRoomIds.has(result)) {
    typinggameRoomIds.add(result)
    return result
  } else {
    console.log('roomId exists, remaking another one.')
    getRoomId()
  }
}
