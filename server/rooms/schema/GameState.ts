import { Schema, ArraySchema, MapSchema, type } from '@colyseus/schema'
import {
  IGameState,
  IGamePlayer,
  IBrickPlayer,
  IBrickPlayerScore,
  IBrickPlayerStatus,
  IBrickGameState,
  DATA_STRUCTURE,
  QUIZ_TYPE,
  IImageContainer,
  IRainGameState,
  IRainGameUser,
  IKeywordRain,
  IRainGameRoomState,
} from '../../../types/IGameState'

/* MOLE GAME ROOM SCHEMA */

/* RAIN GAME ROOM SCHEMA */

export class KeywordRain extends Schema implements IKeywordRain {
  @type('number') y = 10
  @type('number') speed = 1
  @type('string') keyword = ''
  @type('number') x = Math.floor(Math.random() * (550 - 50 + 1)) + 50
  @type('boolean') itemA = false
  @type('boolean') itemB = false

  constructor(keyword: string) {
    super()
    this.keyword = keyword
  }
}
export class RainGameState extends Schema implements IRainGameState {
  @type('number') point = 0
  @type('number') heart = 2
  @type(['string']) item: string[] = []
}

export class RainGameUser extends Schema implements IRainGameUser {
  @type('string') username = ''
  @type('string') character = ''

  constructor(name: string, character: string) {
    super()
    this.username = name
    this.character = character
  }
}

export class RainGameRoomState extends Schema implements IRainGameRoomState {
  @type('string')
  host = ''
  @type('boolean')
  rainGameReady: boolean = true;
  @type('boolean')
  rainGameInProgress: boolean = false;
  @type({ map: RainGameState })
  rainGameStates = new MapSchema<RainGameState>()
  @type({ map: RainGameUser })
  rainGameUsers = new MapSchema<RainGameUser>()
  @type({ map: KeywordRain })
  keywordLists = new MapSchema<KeywordRain>()
  @type('string')
  winner = ''
}

/* BRICK GAME ROOM SCHEMA */

export class ImageContainer extends Schema implements IImageContainer {
  @type('number') imgidx = 0
  @type('string') text = ''

  constructor(imgidx: number, text: string) {
    super()
    this.imgidx = imgidx
    this.text = text
  }
}

export class BrickPlayerStatus extends Schema implements IBrickPlayerStatus {
  @type([ImageContainer]) currentImages = new ArraySchema<ImageContainer>()
  @type('string') selectedOption = DATA_STRUCTURE.NONE
  @type(['string']) commandArray = new ArraySchema<string>()
}

export class BrickPlayerScore extends Schema implements IBrickPlayerScore {
  @type(['number']) pointArray = new ArraySchema<number>()
  @type('number') totalPoint = 0
  @type('number') chance = 3
}

export class BrickPlayer extends Schema implements IBrickPlayer {
  @type(BrickPlayerScore) playerScore = new BrickPlayerScore()
  @type(BrickPlayerStatus) playerStatus = new BrickPlayerStatus()
}

export class BrickGameState extends Schema implements IBrickGameState {
  @type({ map: BrickPlayer }) brickPlayers = new MapSchema<BrickPlayer>()
  @type('number') problemId = 0
  @type('string') problemType = QUIZ_TYPE.NONE
  @type([ImageContainer]) problemImages = new ArraySchema<ImageContainer>()
  @type('boolean') gameInProgress = false
  @type('boolean') gameStarting = false
  @type('number') currentRound = 0
  @type('boolean') hasRoundWinner = false
  @type('string') roundWinner = ''
  @type('string') gameWinner = ''
}

/* GAME ROOM SCHEMA */

export class GamePlayer extends Schema implements IGamePlayer {
  @type('string') username = ''
  @type('string') character = ''

  constructor(username: string, character: string) {
    super()
    this.username = username
    this.character = character
  }
}

export class GameState extends Schema implements IGameState {
  @type({ map: GamePlayer }) players = new MapSchema<GamePlayer>()
  @type('string') host = ''
  @type(BrickGameState) brickgames = new BrickGameState()
  @type(RainGameRoomState) raingames = new RainGameRoomState()
}
