import { Schema, ArraySchema, SetSchema, MapSchema, type } from '@colyseus/schema'
import {
  IPlayer,
  IOfficeState,
  IMoleGame,
  IBrickGame,
  IRainGame,
  IChatMessage,
  IRainGameState,
  IKeywordRain,
  IRainGameUser,
} from '../../../types/IOfficeState'

export class Player extends Schema implements IPlayer {
  @type('string') name = ''
  @type('number') x = 705
  @type('number') y = 500
  @type('string') anim = 'adam_idle_down'
  @type('boolean') readyToConnect = false
  @type('boolean') videoConnected = false
}

export class BrickGame extends Schema implements IBrickGame {
  // @type('string') roomId = getRoomId()
  @type({ set: 'string' }) connectedUser = new SetSchema<string>()
}

export class MoleGame extends Schema implements IMoleGame {
  // @type('string') roomId = getRoomId()
  @type({ set: 'string' }) connectedUser = new SetSchema<string>()
}

export class RainGame extends Schema implements IRainGame {
  // @type('string') roomId = getRoomId()
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

  @type({ map: MoleGame })
  molegames = new MapSchema<MoleGame>()

  @type({ map: BrickGame })
  brickgames = new MapSchema<BrickGame>()

  @type({ map: RainGame })
  raingames = new MapSchema<RainGame>()

  @type([ChatMessage])
  chatMessages = new ArraySchema<ChatMessage>()
}

export class RainGameUser extends Schema implements IRainGameUser{
  @type("string") name = '';
  @type('string') anim = 'adam_idle_down';
}

export class KeywordRain extends Schema implements IKeywordRain{
  @type('number') y = 0;
  @type('number') speed = 1 ;
  @type('string') keyword = '';
  @type('number') x = Math.floor(Math.random()*(550-50+1)) + 50;
  @type('boolean') flicker = false;
  @type('boolean') blind = false;
  @type('boolean') accel = false;
  @type('boolean') multifly = false;
}

export class RainGameState extends Schema implements IRainGameState {
  @type('boolean') rainGameOpen = false;
  @type([KeywordRain]) game: KeywordRain[] = [];
  @type('number') point = 0;
  @type('number') heart = 5;
  @type('number') period = 2000;
  @type(['string']) keywordList: string[] = [];
}


// export const RainGameRoomIds = new Set<string>()
// export const moleGameRoomIds = new Set<string>()
// const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
// const charactersLength = characters.length

// function getRoomId() {
//   let result = ''
//   for (let i = 0; i < 12; i++) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength))
//   }
//   if (!RainGameRoomIds.has(result)) {
//     RainGameRoomIds.add(result)
//     return result
//   } else {
//     console.log('roomId exists, remaking another one.')
//     getRoomId()
//   }
// }
