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
  IKeywordRain
} from '../../../types/IGameState'


/* MOLE GAME ROOM SCHEMA */


/* RAIN GAME ROOM SCHEMA */

export class KeywordRain extends Schema implements IKeywordRain{
  @type('string') owner = '';
  @type('number') y = 0;
  @type('number') speed = 1 ;
  @type('string') keyword = '';
  @type('number') x = Math.floor(Math.random()*(550-50+1)) + 50;
  @type('boolean') flicker = false;
  @type('boolean') blind = false;
  @type('boolean') accel = false;
  @type('boolean') multifly = false;
  @type('boolean') rendered = false;

  constructor(keyword: string) {
    super();
    this.keyword = keyword;
  }
}
export class RainGameState extends Schema implements IRainGameState {
  @type('string') owner = '';
  @type([ "string" ]) item: string[] = [];
  @type('number') point = 0;
  @type('number') heart = 5;
  @type('number') period = 2000;
  @type([KeywordRain]) words = new ArraySchema<KeywordRain>();
  @type([ "string" ]) used: string[] = [];
}

export class RainGameUser extends Schema implements IRainGameUser{
  @type("string") username = '';
  @type('string') character = '';
  @type('string') clientId = '';
}

/* BRICK GAME ROOM SCHEMA */

export class BrickPlayerScore extends Schema implements IBrickPlayerScore {
  @type(['number']) pointArray = new ArraySchema<number>()
  @type('number') totalPoint = 0
}

export class ImageContainer extends Schema implements IImageContainer {
  @type('number') imgidx = 0
  @type('string') text = ''

  constructor(imgidx: number, text: string) {
    super()
    this.imgidx = imgidx;
    this.text = text;
  }
}

export class BrickPlayerStatus extends Schema implements IBrickPlayerStatus {
  // @type([ImageContainer]) currentImages = new Array<ImageContainer>()
  @type([ImageContainer]) currentImages = new ArraySchema<ImageContainer>()
  @type('string') selectedOption = DATA_STRUCTURE.NONE
  @type(['string']) commandArray = new ArraySchema<string>()
}

export class BrickPlayer extends Schema implements IBrickPlayer {
  // @type('string') name: string
  @type(BrickPlayerScore) playerScore = new BrickPlayerScore()
  @type(BrickPlayerStatus) playerStatus = new BrickPlayerStatus()
}

export class BrickGameState extends Schema implements IBrickGameState {
  @type({ map: BrickPlayer }) brickPlayers = new MapSchema<BrickPlayer>()
  @type('string') currentQuiz = QUIZ_TYPE.NONE
  @type([ImageContainer]) originalImages = new ArraySchema<ImageContainer>()
  @type('boolean') gameInProgress = false
  @type('boolean') gameStarting = false
}

/* GAME ROOM SCHEMA */

export class GamePlayer extends Schema implements IGamePlayer {
  @type('string') name = ''
  @type('string') anim = 'adam_idle_down'

  constructor(name: string) {
    super()
    this.name = name
  }
}

export class GameState extends Schema implements IGameState {
  @type({ map: GamePlayer }) players = new MapSchema<GamePlayer>()
  @type('string') host = ''
  // molegames
  @type({ map: RainGameState }) rainGameStates = new MapSchema<RainGameState>()
  @type(BrickGameState) brickgames = new BrickGameState()
}
