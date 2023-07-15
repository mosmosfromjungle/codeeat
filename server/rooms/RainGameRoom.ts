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

    this.onMessage(Message.RAIN_GAME_START_C, (client, content) => {
      const { value } = content
      this.state.raingames.rainGameInProgress = value
      this.broadcast(Message.RAIN_GAME_START_S, { progress: value }, { afterNextPatch: true })
    })

    this.onMessage(Message.RAIN_GAME_WORD_C, (client, content) => {
      const { word, sessionId, states } = content
      this.state.raingames.rainGameStates.forEach((gameState, sessionId) => {
        if (sessionId === client.sessionId) {
          gameState.point += 1
        }
      })

      this.broadcast(
        Message.RAIN_GAME_WORD_S,
        { word, states: this.state.raingames.rainGameStates },
        { afterNextPatch: true }
      )
    })

    this.onMessage(Message.RAIN_GAME_HEART_C, (client, content) => {
      const { sessionId } = content
      this.state.raingames.rainGameStates.forEach((gameState, currentSessionId) => {
        if (currentSessionId === client.sessionId) {
          gameState.heart -= 1

          if (gameState.heart === 0) {
            // Find the other session ID
            let otherSessionId = null
            this.state.raingames.rainGameStates.forEach((_, sid) => {
              if (sid !== currentSessionId) {
                otherSessionId = sid
              }
            })

            // Set the winnerUsername to the username corresponding to the other sessionId
            if (otherSessionId) {
              const winnerUsername = this.state.raingames.rainGameUsers[otherSessionId].username
              this.state.raingames.winner = winnerUsername

              this.broadcast(
                Message.RAIN_GAME_END_S,
                { username: winnerUsername },
                { afterNextPatch: true }
              )
            }
          }
        }
      })

      this.broadcast(
        Message.RAIN_GAME_HEART_S,
        { states: this.state.raingames.rainGameStates },
        { afterNextPatch: true }
      )
    })

    this.onMessage(Message.RAIN_GAME_ITEM_C, (client, data) => {
      const { item } = data
      this.state.raingames.rainGameStates.forEach((gameState, sessionId) => {
        if (sessionId !== client.sessionId) {
          if (item === 'A') {
            gameState.item.push('A')
            console.log(gameState.item)
          }
          if (item === 'B') {
            gameState.item.push('B')
          }
          if (item === 'NA') {
            gameState.item.shift()
          }
        }
      })

      this.broadcast(
        Message.RAIN_GAME_HEART_S,
        { states: this.state.raingames.rainGameStates },
        { afterNextPatch: true }
      )
    })

    this.onMessage(
      Message.RAIN_GAME_USER_C,
      (client, data: { username: string; character: string }) => {
        this.state.raingames.rainGameUsers.set(
          client.sessionId,
          new RainGameUser(data.username, data.character)
        )
        this.state.raingames.rainGameStates.set(client.sessionId, new RainGameState())
        if (this.state.raingames.rainGameUsers.size === 2) {
          this.state.raingames.rainGameReady = true
        }

        this.broadcast(
          Message.RAIN_GAME_USER_S,
          {
            user: this.state.raingames.rainGameUsers,
            state: this.state.raingames.rainGameStates,
            host: this.state.host,
          },
          { afterNextPatch: true }
        )
      }
    )

    this.onMessage(Message.RAIN_GAME_END_C, (client, data: { username: string }) => {
      this.state.raingames.winner = username
      this.broadcast(Message.RAIN_GAME_END_S, data, { afterNextPatch: true })
    })

    this.onMessage(Message.RAIN_GAME_OUT_C, (client, data: { username: string }) => {
      for (let key of this.state.raingames.rainGameUsers.keys()) {
        if (this.state.raingames.rainGameUsers.get(key).username === data.username) {
          this.state.raingames.rainGameUsers.delete(key)
          break
        }
      }
      this.broadcast(Message.RAIN_GAME_OUT_S, data, { except: client, afterNextPatch: true})

    })
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
    this.state.raingames.rainGameStates.set(client.sessionId, new RainGameState())
    client.send(Message.SEND_ROOM_DATA, {
      id: this.roomId,
      name: this.name,
      description: this.description,
      host: this.state.host,
    })

    // this.broadcast(Message.RAIN_GAME_READY_S)
  }

  onLeave(client: Client, consented: boolean) {
    if (consented) {
      // client.sessionId로 매핑된 RainGameUser 삭제
      delete this.state.raingames.rainGameUsers[client.sessionId]

      // client.sessionId로 매핑된 RainGameState 삭제
      delete this.state.raingames.rainGameStates[client.sessionId]

      this.broadcast(
        Message.RAIN_GAME_USER_S,
        { user: this.state.raingames.rainGameUsers, state: this.state.raingames.rainGameStates },
        { afterNextPatch: true }
      )
    }
  }

  onDispose() {
    console.log('room', this.roomId, 'disposing...')
    this.dispatcher.stop()
  }
}
