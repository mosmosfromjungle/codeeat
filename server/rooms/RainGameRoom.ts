import bcrypt from 'bcrypt'
import { Room, Client, ServerError } from 'colyseus'
import { Dispatcher } from '@colyseus/command'
import { Message } from '../../types/Messages'
import { IGameRoomData } from '../../types/Rooms'
import { RainGameState, RainGameUser } from './schema/GameState'
import { GameState } from './schema/GameState'

export class RainGameRoom extends Room<GameState> {
  private dispatcher = new Dispatcher(this)
  private name: string
  private description: string
  private password: string | null = null

  async onCreate(options: IGameRoomData) {
    const { name, description, password, username } = options
    this.name = name
    this.description = description
    this.autoDispose = true
    this.maxClients = 2

    let hasPassword = false
    if (password) {
      const salt = await bcrypt.genSalt(10)
      this.password = await bcrypt.hash(password, salt)
      hasPassword = true
    }

    this.setMetadata({ name, description, hasPassword })
    this.setState(new GameState())
    this.state.host = username

    this.onMessage(Message.RAIN_GAME_START_C, (client, content) =>
      this.handleRainGameStart(client, content)
    )

    this.onMessage(Message.RAIN_GAME_WORD_C, (client, content) => {
      const { word, sessionId, states } = content
      console.log("점수 관련 상태변경 수신:",word)
      this.state.raingames.rainGameStates.forEach((gameState, sessionId) => {
        if (sessionId === client.sessionId) {
          gameState.point += 1;
        }
      });

      this.broadcast(Message.RAIN_GAME_WORD_S, { word, states: this.state.raingames.rainGameStates},{ afterNextPatch: true });
      console.log("점수 관련 상태변경 송신:", JSON.parse(JSON.stringify(this.state.raingames.rainGameStates)))
    });

    this.onMessage(Message.RAIN_GAME_HEART_C, (client,content)  => {
      console.log("하트 관련 상태변경 수신:")
      const { sessionId } = content
      this.state.raingames.rainGameStates.forEach((gameState,sessionId) => {
        if (sessionId === client.sessionId) {
          gameState.heart -= 1;
        }
      });
  
      this.broadcast(Message.RAIN_GAME_HEART_S, { states: this.state.raingames.rainGameStates },{ afterNextPatch: true });
      console.log("하트 관련 상태변경 송신:",JSON.parse(JSON.stringify(this.state.raingames.rainGameStates)))
    })

    this.onMessage(Message.RAIN_GAME_USER_C, (client, data) => this.handleRainGameUser(client, data))

  }

  async onAuth(client: Client, options: { password: string | null }) {
    if (this.password) {
      if (options.password) {
        const validPassword = await bcrypt.compare(options.password, this.password)
        if (!validPassword) {
          throw new ServerError(403, 'Password is incorrect!')
        }
      }
    }
    return true
  }

  onJoin(client: Client, options: any) {
    const { username } = options
    this.state.raingames.rainGameStates.set(client.sessionId, new RainGameState(username))
    client.send(Message.SEND_ROOM_DATA, {
      id: this.roomId,
      name: this.name,
      description: this.description,
      host: this.state.host,
    })

    if (this.clients.length === 2) {
      this.state.raingames.rainGameReady = true
      this.broadcast(Message.RAIN_GAME_READY_S)
    }
  }

  onLeave(client: Client, consented: boolean) {}

  onDispose() {
    console.log('room', this.roomId, 'disposing...')
    this.dispatcher.stop()
  }
  // Handle RAIN_GAME_START message
  private handleRainGameStart(client: Client, content: any) {
    console.log('handleRainGameStart')
    this.state.raingames.rainGameInProgress = true
    this.broadcast(Message.RAIN_GAME_START_S)
    // this.handleRainGameWord(this)
  }

  // Handle RAIN_GAME_USER message
  private handleRainGameUser(client: Client, data: any) {
    const { username, character } = data

    this.state.raingames.rainGameUsers.set(client.sessionId, new RainGameUser(username, character))
    this.state.raingames.rainGameStates.set(client.sessionId, new RainGameState())

    this.broadcast(Message.RAIN_GAME_USER_S, {user : this.state.raingames.rainGameUsers, state : this.state.raingames.rainGameStates},{ afterNextPatch: true })
    console.log("유저 관련 상태 변경 송신")
  }
}
