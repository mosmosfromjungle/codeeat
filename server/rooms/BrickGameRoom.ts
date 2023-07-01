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

    this.onMessage(Message.BRICK_GAME_COMMAND, (client, message: { command: string })=> {
      this.handleCommand(client, message.command)
    })

    this.onMessage(Message.BRICK_GAME_START, () => {
      this.startGame()
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
  }

  onLeave(client: Client) {
    if (this.state.players.has(client.sessionId)) {
      this.state.players.delete(client.sessionId)
    }
    
    this.broadcastPlayersData(this)
  }

  handleCommand(client: Client, command: string) {
    const player = this.state.brickgames.brickPlayers.get(client.sessionId)
    if (!player) throw new Error('handleCommand Error - no client')
    
    const playerStatus = player.playerStatus
    const lowercaseCommand = command.toLowerCase()

    if (lowercaseCommand === 'submit') {
      const playerScore = player.playerScore
      let roundPoint = 0
      const problemType = this.state.brickgames.problemType
      const problemId = this.state.brickgames.problemId
      // 1. 정답이 맞는지 확인 -> 틀렸으면 에러 전달
      const submitArray = Array.from(playerStatus.currentImages.values()).map((value) => value.imgidx)
      console.log('submitted image array: ', submitArray)
      if (problemType === QUIZ_TYPE.SAME2) {
        if (submitArray.length === 2 && submitArray[0] === submitArray[1]) {
          roundPoint += 1
        } else {
          playerScore.chance -= 1
          this.sendError(client, '틀렸습니다!')
          return
        }
      } else if (problemType === QUIZ_TYPE.SAME3) {
        if (submitArray.length === 3 
          && submitArray[0] === submitArray[1]
          && submitArray[1] === submitArray[2]
          && submitArray[2] === submitArray[0]) {
            roundPoint += 1
          } else {
            playerScore.chance -= 1
            this.sendError(client, '틀렸습니다!')
            return
          }
      } else if (problemType === QUIZ_TYPE.DIFF3) {
        if (submitArray.length === 3 
          && submitArray[0] !== submitArray[1]
          && submitArray[1] !== submitArray[2]
          && submitArray[2] !== submitArray[0]) {
            roundPoint += 1
          } else {
            playerScore.chance -= 1
            this.sendError(client, '틀렸습니다!')
            return
          }
      } else {
        throw new Error('채점하는데 뭔가 이상함')
      }
      // 2. 먼저 맞췄는지 확인
      if (this.state.brickgames.hasRoundWinner === false) {
        console.log('먼저 맞춘 사람이 1점 더 획득')
        this.state.brickgames.hasRoundWinner = true
        roundPoint += 1
      }
      // 3. 추가 점수를 획득할 수 있는지 확인
      ExtraPoints.forEach((value) => {
        if (value.problemId == problemId && value.dsType === playerStatus.commandArray[0]) {
          console.log('commandarray[0]: ', playerStatus.commandArray[0])
          console.log('add ', value.point, ' to roundPoint for problemId ', value.problemId, ' and ds type ', value.dsType)
          roundPoint += value.point
        }
      })
      playerScore.totalPoint += roundPoint
      playerScore.pointArray.push(roundPoint)
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

  sendError(client: Client, message: string) {
    client.send(Message.BRICK_GAME_ERROR, message)
  }

  broadcastGameState() {
    this.sendGameState()
  }
  
  sendGameState(client?: Client) {
    const gameState = {
      problemType: this.state.brickgames.problemType,
      problemImages: this.state.brickgames.problemImages,
      gameInProgress: this.state.brickgames.gameInProgress,
      gameStarting: this.state.brickgames.gameStarting,
      currentRound: this.state.brickgames.currnetRound,
    }
    if (!client) {
      this.broadcast(Message.BRICK_GAME_STATE, gameState)
    } else {
      client.send(Message.BRICK_GAME_STATE, gameState)
    }
  }

  broadcastPlayersData(room: BrickGameRoom) {
    const players = Array.from(room.state.players.values()).map((player, key) => ({
      sessionId: key,
      name: player.name,
      character: player.anim
    }))
    console.log('players: ', players)
    room.broadcast(Message.BRICK_GAME_PLAYERS, players);
  }

  broadcastPlayerUpdate(client: Client) {
    const playerUpdate = {client: client,
      payload: this.state.brickgames.brickPlayers.get(client.sessionId),
    }
    this.broadcast(Message.BRICK_PLAYER_UPDATE, playerUpdate)
  }

  startGame() {
    if (this.state.brickgames.gameInProgress) return
    this.state.brickgames.gameInProgress = true

    this.newRound()

    this.broadcastGameState()
    this.clients.map((value) => {
      this.broadcastPlayerUpdate(value)
    })
  }

  newRound() {
    this.state.brickgames.hasRoundWinner = false
    
    const newProblem = this.getRandomProblem()
    console.log('problem: ', newProblem)
    this.state.brickgames.problemId = newProblem.problemId
    this.state.brickgames.problemType = newProblem.problemType

    const newArray = this.generateNumberArray(newProblem.problemType, newProblem.generateKey)
    console.log('problem array: ', newArray)

    if (!newArray) {
      throw new Error('새로운 문제 배열을 생성하는데 실패하였습니다.')
    }
    this.state.brickgames.problemImages = new ArraySchema<ImageContainer>(
      ...newArray.map((element, index) => {
        const imgidx = element;
        const text = (index + 1).toString()
        return new ImageContainer(imgidx, text)
      })
    )
    this.state.brickgames.brickPlayers.forEach((value) => {
      value.playerStatus.currentImages = this.state.brickgames.problemImages
    })
  }

  getRandomProblem() {
    const randomIndex = Math.floor(Math.random() * ProblemTypes.length);
    return ProblemTypes[randomIndex];
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

  generateNumberArray(problemType, generateKey) {
    const numbers = [1, 2, 3, 4, 5, 6];
    let dupCount
    let restCount
    let isSame
    let result: number[] = []

    if (problemType === QUIZ_TYPE.SAME2) {
      dupCount = 2
      restCount = 4
      isSame = true
    } else if (problemType === QUIZ_TYPE.SAME3) {
      dupCount = 3
      restCount = 3
      isSame = true
    } else if (problemType === QUIZ_TYPE.DIFF3 && generateKey === 1) {
      dupCount = 1
      restCount = 4
      isSame = false
    } else if (problemType === QUIZ_TYPE.DIFF3 && generateKey === 2) {
      dupCount = 2
      restCount = 2
      isSame = false
    } else {
      return
    }
  
    if (isSame) {
      // 랜덤하게 1개의 숫자 선택 후 배열에서 제거
      const removedNumber = numbers.splice(Math.floor(Math.random() * numbers.length), 1)[0]
    
      let otherNumbers: number[] = []
      for (let i = 0; i < restCount; i++) {
        otherNumbers.push(numbers.splice(Math.floor(Math.random() * numbers.length), 1)[0])
      }
    
      if (generateKey === 'front') {
        for (let j = 0; j < dupCount; j++) {
          result.push(removedNumber)
        }
        otherNumbers.forEach(number => {
          result.push(number)
        })
      } else if (generateKey === 'back') {
        result = otherNumbers.slice()
        for (let j = 0; j <  dupCount; j++) {
          result.push(removedNumber)
        }
      } else if (generateKey === 'middle') {
        result = otherNumbers.slice()
        const randomIndex = Math.floor(Math.random() * (result.length - 1)) + 1
        for (let j = 0; j <  dupCount; j++) {
          result.splice(randomIndex, 0, removedNumber)
        }
      } else if (generateKey === 'mix') {
        result = otherNumbers.slice()
        const indices: number[] = []
        while (indices.length < dupCount) {
          const index = Math.floor(Math.random() * (result.length + 1))
          if (!indices.includes(index)) {
            indices.push(index)
          }
        }
        indices.sort((a, b) => b - a)
        // 인덱스에 숫자 삽입
        indices.forEach(index => {
          result.splice(index, 0, removedNumber)
        })
      }
      return result
    } else {
      for (let j = 0; j < dupCount; j++) {
        const removedNumber = numbers.splice(Math.floor(Math.random() * numbers.length), 1)[0]
        result = [...result, removedNumber, removedNumber];
      }
      for (let i = 0; i < restCount; i++) {
        result.push(numbers.splice(Math.floor(Math.random() * numbers.length), 1)[0])
      }
      for (let i = result.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [result[i], result[randomIndex]] = [result[randomIndex], result[i]];
      }
      return result
    }
  }
}

const ProblemTypes = [
  {
      problemId: 1,
      problemType: QUIZ_TYPE.SAME2,
      generateKey: 'front',
  },
  {
      problemId: 2,
      problemType: QUIZ_TYPE.SAME2,
      generateKey: 'back',
  },
  {
      problemId: 3,
      problemType: QUIZ_TYPE.SAME2,
      generateKey: 'middle',
  },
  {
      problemId: 4,
      problemType: QUIZ_TYPE.SAME2,
      generateKey: 'mix',
  },
  {
      problemId: 5,
      problemType: QUIZ_TYPE.SAME3,
      generateKey: 'front',
  },
  {
      problemId: 6,
      problemType: QUIZ_TYPE.SAME3,
      generateKey: 'back',
  },
  {
      problemId: 7,
      problemType: QUIZ_TYPE.SAME3,
      generateKey: 'middle',
  },
  {
      problemId: 8,
      problemType: QUIZ_TYPE.SAME3,
      generateKey: 'mix',
  },
  {
      problemId: 9,
      problemType: QUIZ_TYPE.DIFF3,
      generateKey: 1,   // diplicate count
  },
  {
      problemId: 10,
      problemType: QUIZ_TYPE.DIFF3,
      generateKey: 2,
  },
]

const ExtraPoints = [
  {
      problemId: 1,
      dsType: 'list',
      point: 1,
  },
  {
      problemId: 1,
      dsType: 'deque',
      point: 1,
  },
  {
      problemId: 1,
      dsType: 'stack',
      point: 2,
  },
  {
      problemId: 2,
      dsType: 'deque',
      point: 2,
  },
  {
      problemId: 2,
      dsType: 'list',
      point: 1,
  },
  {
      problemId: 3,
      dsType: 'queue',
      point: 2,
  },
  {
      problemId: 3,
      dsType: 'deque',
      point: 1,
  },
  {
      problemId: 3,
      dsType: 'list',
      point: 1,
  },
  {
      problemId: 4,
      dsType: 'list',
      point: 2,
  },
  {
      problemId: 5,
      dsType: 'list',
      point: 1,
  },
  {
      problemId: 5,
      dsType: 'deque',
      point: 1,
  },
  {
      problemId: 5,
      dsType: 'stack',
      point: 2,
  },
  {
      problemId: 6,
      dsType: 'deque',
      point: 2,
  },
  {
      problemId: 6,
      dsType: 'list',
      point: 1,
  },
  {
      problemId: 7,
      dsType: 'queue',
      point: 2,
  },
  {
      problemId: 7,
      dsType: 'deque',
      point: 1,
  },
  {
      problemId: 7,
      dsType: 'list',
      point: 1,
  },
  {
      problemId: 8,
      dsType: 'list',
      point: 2,
  },
  {
      problemId: 9,
      dsType: 'set',
      point: 2,
  },
  {
      problemId: 10,
      dsType: 'set',
      point: 2,
  },
  {
      problemId: 11,
      dsType: 'set',
      point: 2,
  },
  {
      problemId: 12,
      dsType: 'set',
      point: 2,
  },
]