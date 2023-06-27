import bcrypt from 'bcrypt'
import { Room, Client, ServerError } from 'colyseus'
import { Dispatcher } from '@colyseus/command'
import { Message } from '../../types/Messages'
import { IGameRoomData } from '../../types/Rooms'
import { BrickPlayer, GameState, GamePlayer, ImageContainer } from './schema/GameState'
import BrickGameCommand from './commands/BrickGameCommand'
import { IGameState, DATA_STRUCTURE, QUIZ_TYPE } from '../../types/IGameState'
import { ArraySchema } from '@colyseus/schema'

const FORMAT_ERROR = '제거할 숫자를 같이 입력해주세요.'
const COMMAND_ERROR = '해당 자료구조에서 사용되지 않는 연산입니다!'
const OPTION_ERROR = '자료구조를 입력해주세요!'

export class BrickGameRoom extends Room<IGameState> {
  private dispatcher = new Dispatcher(this)
  private name: string
  private description: string
  private password: string | null = null

  async onCreate(options: IGameRoomData) {
    const { name, description, password } = options
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

    this.onMessage(Message.BRICK_GAME_COMMAND, (client, message: { command: string })=> {
      this.handleCommand(client, message.command)
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
    this.state.players.set(client.sessionId, new GamePlayer(username))
    this.state.brickgames.brickPlayers.set(client.sessionId, new BrickPlayer())

    client.send(Message.SEND_ROOM_DATA, {
      id: this.roomId,
      name: this.name,
      description: this.description,
    })

    this.sendGameState(client)
    this.broadcastPlayersData(this)

    // if (this.state.players.size === this.maxClients) {
    //   this.startGame()
    // }


    // UGLY: 임시 
    this.state.brickgames.originalImages = new ArraySchema<ImageContainer>(
      new ImageContainer( 1, '1'),
      new ImageContainer( 1, '2'),
      new ImageContainer( 2, '3'),
      new ImageContainer( 3, '4'),
      new ImageContainer( 4, '5'),
      new ImageContainer( 5, '6'),
    )
    
    this.state.brickgames.currentQuiz = QUIZ_TYPE.SAME2
    this.broadcastGameState()
    this.state.brickgames.brickPlayers.forEach((value, key, map) => {
      value.playerStatus.currentImages = this.state.brickgames.originalImages
    })
    this.clients.map((value, index, array) => {
      this.broadcastPlayerUpdate(value)
    })
  }

  onLeave(client: Client) {
    if (this.state.players.has(client.sessionId)) {
      this.state.players.delete(client.sessionId)
    }
    
    this.broadcastPlayersData(this)
  }

  // TODO: sum 대신 제출을 구현해야함 
  handleCommand(client: Client, command: string) {
    const playerStatus = this.state.brickgames.brickPlayers.get(client.sessionId)?.playerStatus
    if (!playerStatus) return 'server error'
    const lowercaseCommand = command.toLowerCase();

    if (lowercaseCommand === 'sum') {
      // 숫자 합 계산 로직
      // const sum = this.state.brickgames.currentImages.reduce((total, image) => total + parseInt(image.text), 0);
      // if (this.state.n == sum) {
      //   // 정답 처리
      //   this.restoreImages();
      //   // this.sendToClient(client, 'correct');
      // } else {
      //   // 오답 처리
      //   this.restoreImages();
      //   // this.sendToClient(client, 'incorrect');
      // }
    } else if (lowercaseCommand === 'restore') {
        this.dispatcher.dispatch(new BrickGameCommand(), { client, command: 'restore', commandText: command })
    } else if (lowercaseCommand === 'reset') {
      this.dispatcher.dispatch(new BrickGameCommand(), { client, command: 'reset', commandText: command })
    } else {
      switch (playerStatus.selectedOption) {
        case DATA_STRUCTURE.LIST:
          if (lowercaseCommand.startsWith('remove')) {
            const match = command.match(/remove\((\d+)\)/) || command.match(/discard\((\d+)\)/);
            if (match) {
              const number = match[1];
              const index = playerStatus.currentImages.findIndex((image) => image.text === number);
              if (index !== -1) {
                this.dispatcher.dispatch(new BrickGameCommand(), { client, command: 'remove', commandText: command, index: index })
              }
            } else {
              this.sendError(client, FORMAT_ERROR)
            }
          } else if (lowercaseCommand === 'pop') {
            this.dispatcher.dispatch(new BrickGameCommand(), { client, command: 'remove', commandText: command, index: playerStatus.currentImages.length - 1 })
          } else {
            this.sendError(client, COMMAND_ERROR)
          }
          break;
        case DATA_STRUCTURE.SET:
          if (lowercaseCommand.startsWith('remove') || lowercaseCommand.startsWith('discard')) {
            const match = command.match(/remove\((\d+)\)/) || command.match(/discard\((\d+)\)/);
            if (match) {
              const number = match[1];
              const index = playerStatus.currentImages.findIndex((image) => image.text === number);
              if (index !== -1) {
                this.dispatcher.dispatch(new BrickGameCommand(), { client, command: 'remove', commandText: command, index: index })
              }
            } else {
              this.sendError(client, FORMAT_ERROR)
            }
          } else {
            this.sendError(client, COMMAND_ERROR)
          }
          break;
        case DATA_STRUCTURE.STACK:
          if (lowercaseCommand === 'pop') {
            this.dispatcher.dispatch(new BrickGameCommand(), { client, command: 'remove', commandText: command, index: playerStatus.currentImages.length - 1 })
          } else {
            this.sendError(client, COMMAND_ERROR)
          }
          break;
        case DATA_STRUCTURE.QUEUE:
          if (lowercaseCommand === 'dequeue') {
            this.dispatcher.dispatch(new BrickGameCommand(), { client, command: 'remove', commandText: command, index: 0 })
          } else {
            this.sendError(client, COMMAND_ERROR)
          }
          break;
        case DATA_STRUCTURE.DEQUE:
          if (lowercaseCommand === 'popleft') {
            this.dispatcher.dispatch(new BrickGameCommand(), { client, command: 'remove', commandText: command, index: 0 })
          } else if (lowercaseCommand === 'pop') {
            this.dispatcher.dispatch(new BrickGameCommand(), { client, command: 'remove', commandText: command, index: playerStatus.currentImages.length - 1 })
          } else {
            this.sendError(client, COMMAND_ERROR)
          }
          break;
        default:
          if (lowercaseCommand === DATA_STRUCTURE.LIST) {
            this.dispatcher.dispatch(new BrickGameCommand(), { client, command: DATA_STRUCTURE.LIST, commandText: command })
          } else if (lowercaseCommand === DATA_STRUCTURE.SET) {
            this.dispatcher.dispatch(new BrickGameCommand(), { client, command: DATA_STRUCTURE.SET, commandText: command })
          } else if (lowercaseCommand === DATA_STRUCTURE.STACK) {
            this.dispatcher.dispatch(new BrickGameCommand(), { client, command: DATA_STRUCTURE.STACK, commandText: command })
          } else if (lowercaseCommand === DATA_STRUCTURE.QUEUE) {
            this.dispatcher.dispatch(new BrickGameCommand(), { client, command: DATA_STRUCTURE.QUEUE, commandText: command })
          } else if (lowercaseCommand === DATA_STRUCTURE.DEQUE) {
            this.dispatcher.dispatch(new BrickGameCommand(), { client, command: DATA_STRUCTURE.DEQUE, commandText: command })
          } else {
            this.sendError(client, OPTION_ERROR)
          }
          break;
      }
    }
    this.broadcastPlayerUpdate(client)
  }

  broadcastPlayersData(room: BrickGameRoom) {
    const players = Array.from(room.state.players.values())
    room.broadcast(Message.SEND_GAME_PLAYERS, players);
  }

  sendError(client: Client, message: string) {
    client.send(Message.BRICK_GAME_ERROR, message)
  }

  sendGameState(client: Client) {
    const gameState = {
      currentQuiz: this.state.brickgames.currentQuiz,
      originalImages: this.state.brickgames.originalImages,
      gameInProgress: this.state.brickgames.gameInProgress,
      gameStarting: this.state.brickgames.gameStarting,
    }
    client.send(Message.BRICK_GAME_STATE, gameState)
  }

  broadcastGameState() {
    const gameState = {
      currentQuiz: this.state.brickgames.currentQuiz,
      originalImages: this.state.brickgames.originalImages,
      gameInProgress: this.state.brickgames.gameInProgress,
      gameStarting: this.state.brickgames.gameStarting,
    }
    this.broadcast(Message.BRICK_GAME_STATE, gameState)
  }

  broadcastPlayerUpdate(client: Client) {
    const playerUpdate = {client: client,
      payload: this.state.brickgames.brickPlayers.get(client.sessionId),
    }
    this.broadcast(Message.BRICK_PLAYER_UPDATE, playerUpdate)
  }

  startGame() {
    if (this.state.brickgames.gameStarting || this.state.brickgames.gameInProgress) {
      return
    }

    this.state.brickgames.gameStarting = true

    // Start the game after 10 seconds
    setTimeout(() => {
      this.state.brickgames.gameStarting = false
      this.state.brickgames.gameInProgress = true

      // UGLY: 임시 
      this.state.brickgames.originalImages = new ArraySchema<ImageContainer>(
        new ImageContainer( 1, '1'),
        new ImageContainer( 1, '2'),
        new ImageContainer( 2, '3'),
        new ImageContainer( 3, '4'),
        new ImageContainer( 4, '5'),
        new ImageContainer( 5, '6'),
      )
      this.state.brickgames.currentQuiz = QUIZ_TYPE.SAME2
      this.broadcastGameState()
      this.state.brickgames.brickPlayers.forEach((value, key, map) => {
        value.playerStatus.currentImages = this.state.brickgames.originalImages
      })
      this.clients.map((value, index, array) => {
        this.broadcastPlayerUpdate(value)
      })
    }, 1000)
  }

  endGame() {
    if (!this.state.brickgames.gameInProgress) {
      return
    }

    this.state.brickgames.gameInProgress = false

    // Disconnect all clients after 10 seconds and the room will autodispose
    setTimeout(() => {
      for (const client of this.clients.values()) {
        client.leave()
      }
    }, 10000)
  }

  onDispose() {
    console.log('room', this.roomId, 'disposing...')
    this.dispatcher.stop()
  }
}
