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

  /* 플레이어가 입장했을 때 방 정원을 모두 채웠다면 게임 준비 완료 상태로 표시 */
  onJoin(client: Client, options: any) {
    const { username, character } = options
    this.state.players.set(client.sessionId, new GamePlayer(username, character))
    this.state.brickgames.brickPlayers.set(client.sessionId, new BrickPlayer())

    client.send(Message.SEND_ROOM_DATA, {
      id: this.roomId,
      name: this.name,
      description: this.description,
    })

    if (this.clients.length >= this.maxClients) {
      this.state.brickgames.gameStarting = true
    }
    this.sendGameState(client)
    this.broadcastPlayersData()

    // 임시
    // if (this.clients.length >= this.maxClients) {
    //   this.startGame()
    // }
  }

  /* 플레이어가 퇴장할 때 아직 게임이 진행중인 상태라면 5초 후 게임을 강제 종료 */
  onLeave(client: Client) {
    if (this.state.players.has(client.sessionId)) {
      this.state.players.delete(client.sessionId)
    }
    
    this.broadcastPlayersData()

    if (this.state.brickgames.gameInProgress) {
      this.endGame()
    }
  }

  handleCommand(client: Client, command: string) {
    const player = this.state.brickgames.brickPlayers.get(client.sessionId)
    if (!player) throw new Error('handleCommand Error - no client')
    const playerStatus = player.playerStatus
    const playerScore = player.playerScore
    const lowercaseCommand = command.toLowerCase()
    let endRound = false

    if (lowercaseCommand === 'submit') {
      endRound = this.checkSubmission(client)
    } else if (lowercaseCommand === 'reset') {
      playerStatus.selectedOption = DATA_STRUCTURE.NONE
      playerStatus.currentImages.splice(0, playerStatus.currentImages.length)
      this.state.brickgames.problemImages.forEach((image) => {
        playerStatus.currentImages.push(image);
      })
      playerStatus.commandArray.clear()
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
          /* List 자료구조에서 pop 연산 제거 */
          // } else if (lowercaseCommand === 'pop') {
          //   this.dispatcher.dispatch(new BrickGameCommand(), { client, command: 'remove', commandText: command, index: playerStatus.currentImages.length - 1 })
          } else {
            this.sendError(client, COMMAND_ERROR)
          }
          break
        case DATA_STRUCTURE.SET:
          if (lowercaseCommand.startsWith('remove')) {
            const match = command.match(/remove\((\d+)\)/)
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
          break
        case DATA_STRUCTURE.STACK:
          if (lowercaseCommand === 'pop') {
            this.dispatcher.dispatch(new BrickGameCommand(), { client, command: 'remove', commandText: command, index: playerStatus.currentImages.length - 1 })
          } else {
            this.sendError(client, COMMAND_ERROR)
          }
          break
        case DATA_STRUCTURE.QUEUE:
          if (lowercaseCommand === 'dequeue') {
            this.dispatcher.dispatch(new BrickGameCommand(), { client, command: 'remove', commandText: command, index: 0 })
          } else {
            this.sendError(client, COMMAND_ERROR)
          }
          break
        case DATA_STRUCTURE.DEQUE:
          if (lowercaseCommand === 'popleft') {
            this.dispatcher.dispatch(new BrickGameCommand(), { client, command: 'remove', commandText: command, index: 0 })
          } else if (lowercaseCommand === 'pop') {
            this.dispatcher.dispatch(new BrickGameCommand(), { client, command: 'remove', commandText: command, index: playerStatus.currentImages.length - 1 })
          } else {
            this.sendError(client, COMMAND_ERROR)
          }
          break
        default:
          if (lowercaseCommand === DATA_STRUCTURE.LIST) {
            // this.dispatcher.dispatch(new BrickGameCommand(), { client, command: DATA_STRUCTURE.LIST, commandText: command })
            playerStatus.selectedOption = DATA_STRUCTURE.LIST
            playerStatus.commandArray.push(command + ' ')       
          } else if (lowercaseCommand === DATA_STRUCTURE.SET) {
            // this.dispatcher.dispatch(new BrickGameCommand(), { client, command: DATA_STRUCTURE.SET, commandText: command })
            playerStatus.selectedOption = DATA_STRUCTURE.SET
            playerStatus.commandArray.push(command + ' ')
            playerStatus.currentImages = this.filterDuplicate(playerStatus.currentImages)
          } else if (lowercaseCommand === DATA_STRUCTURE.STACK) {
            // this.dispatcher.dispatch(new BrickGameCommand(), { client, command: DATA_STRUCTURE.STACK, commandText: command })
            playerStatus.selectedOption = DATA_STRUCTURE.STACK
            playerStatus.commandArray.push(command + ' ')
          } else if (lowercaseCommand === DATA_STRUCTURE.QUEUE) {
            // this.dispatcher.dispatch(new BrickGameCommand(), { client, command: DATA_STRUCTURE.QUEUE, commandText: command })
            playerStatus.selectedOption = DATA_STRUCTURE.QUEUE
            playerStatus.commandArray.push(command + ' ')
          } else if (lowercaseCommand === DATA_STRUCTURE.DEQUE) {
            // this.dispatcher.dispatch(new BrickGameCommand(), { client, command: DATA_STRUCTURE.DEQUE, commandText: command })
            playerStatus.selectedOption = DATA_STRUCTURE.DEQUE
            playerStatus.commandArray.push(command + ' ')
          } else {
            this.sendError(client, OPTION_ERROR)
          }
          break
      }
    }

    /* 이 플레이어의 커맨트 결과값을 broadcast */
    this.broadcastPlayerUpdate(client)

    /* 이 플레이어의 기회가 모두 소진된 경우 라운드 승자 broadcast, 라운드 종료, 게임 종료 */
    if (playerScore.chance <= 0) {
      this.setRoundWinner(false, client)
      this.endRound()
      setTimeout(() => {
        this.setGameWinner(false, client)
        this.endGame()
      }, 3000);
    }

    /* 해당 클라이언트가 이긴 경우 라운드 초기화 후 새로운 라운드 시작 */
    if (endRound) {
      this.endRound()
      setTimeout(() => {
        if (this.state.brickgames.currentRound === 2) {
          let winnerKey: string | null = null
          let winnerPoint = 0
          this.state.brickgames.brickPlayers.forEach((player, key) => {
            const playerPoint = player.playerScore.totalPoint
            if (playerPoint > 0) {
              if (playerPoint === winnerPoint) {
                this.state.brickgames.gameWinner = 'both'
              } else if (playerPoint >= winnerPoint) {
                winnerKey = key
                winnerPoint = playerPoint
              }
            }
          })
          if (this.state.brickgames.gameWinner !== 'both' && winnerKey !== null) {
            this.state.brickgames.gameWinner = this.state.players.get(winnerKey)!.username
          }
          this.endGame()
        } else {
          this.newRound()
        }
      }, 3000)
    }
  }

  filterDuplicate(currentArray: ArraySchema<ImageContainer>) {
    const uniqueNumbers = new Set()
    const filteredList = new ArraySchema<ImageContainer>()
    currentArray.forEach((elem) => {
      if (!uniqueNumbers.has(elem.imgidx)) {
        filteredList.push(elem)
        uniqueNumbers.add(elem.imgidx)
      }
    })
    return filteredList
  }

  checkSubmission(client: Client) {
    const player = this.state.brickgames.brickPlayers.get(client.sessionId)
    if (!player) throw new Error('handleCommand Error - no client')
    const playerStatus = player.playerStatus
    const playerScore = player.playerScore
    const problemType = this.state.brickgames.problemType
    const problemId = this.state.brickgames.problemId
    let endRound = false
    let roundPoint = 0

    // 0. 다른 사람이 먼저 맞춘 경우 에러 전달
    if (this.state.brickgames.hasRoundWinner) {
      this.sendError(client, '이미 정답을 맞췄어요!')
      return false
    }

    // 1. 정답이 맞는지 확인 -> 틀렸으면 에러 전달
    const submitArray = Array.from(playerStatus.currentImages.values()).map((value) => value.imgidx)
    console.log('submitted image array: ', submitArray)
    if (problemType === QUIZ_TYPE.SAME2) {
      if (submitArray.length === 2 && submitArray[0] === submitArray[1]) {
        roundPoint += 1
      } else {
        playerScore.chance -= 1
        this.sendError(client, '틀렸습니다!')
        return false
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
        return false
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
        return false
      }
    } else {
      throw new Error('채점하는데 뭔가 이상함')
    }

    // 2. 먼저 맞췄는지 확인 (이겼는지)
    if (this.state.brickgames.hasRoundWinner === false) {
      this.setRoundWinner(true, client)
      endRound = true
      roundPoint += 1
    } else {
      this.sendError(client, '이미 정답을 맞췄어요!')
      return false
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

    return endRound
  }

  setRoundWinner(isWinner: boolean, client: Client) {
    // TODO: 두 플레이어 모두 5초 카운트다운, 먼저 맞추지 못한 플레이어는 5초 이내에만 제출할 수 있음
    let winnerUsername
    if (isWinner) {
      winnerUsername = this.state.players.get(client.sessionId)?.username
      if (!winnerUsername) throw new Error('serRoundWinner - no client')
    } else {
      this.state.players.forEach((value, key) => {
        if (key !== client.sessionId) {
          winnerUsername = value.username
        }
      })
    }
    this.state.brickgames.hasRoundWinner = true
    this.state.brickgames.roundWinner = winnerUsername
  }

  setGameWinner(isWinner: boolean, client: Client) {
    let winnerUsername
    if (isWinner) {
      winnerUsername = this.state.players.get(client.sessionId)?.username
      if (!winnerUsername) throw new Error('serRoundWinner - no client')
    } else {
      this.state.players.forEach((value, key) => {
        if (key !== client.sessionId) {
          winnerUsername = value.username
        }
      })
    }
    this.state.brickgames.gameWinner = winnerUsername
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
      currentRound: this.state.brickgames.currentRound,
      hasRoundWinner: this.state.brickgames.hasRoundWinner,
      roundWinner: this.state.brickgames.roundWinner,
      gameWinner: this.state.brickgames.gameWinner,
    }
    if (!client) {
      this.broadcast(Message.BRICK_GAME_STATE, gameState)
    } else {
      client.send(Message.BRICK_GAME_STATE, gameState)
    }
  }

  /* Broadcast player username and character */
  broadcastPlayersData() {
    const players = Array.from(this.state.players.values()).map((player, index) => ({
      sessionId: this.clients[index].sessionId,
      username: player.username,
      character: player.character
    }))
    console.log('players: ', players)
    this.broadcast(Message.BRICK_GAME_PLAYERS, players);
  }

  /* Broadcast updates about a client */
  broadcastPlayerUpdate(client: Client) {
    const playerUpdate = {client: client,
      payload: this.state.brickgames.brickPlayers.get(client.sessionId),
    }
    this.broadcast(Message.BRICK_PLAYER_UPDATE, playerUpdate)
  }

  /* Start the game by starting a new round */
  startGame() {
    if (this.state.brickgames.gameInProgress) return
    this.state.brickgames.gameInProgress = true

    this.newRound()
  }

  /* Start a new round and broadcast */
  newRound() {
    this.state.brickgames.hasRoundWinner = false
    this.state.brickgames.roundWinner = ''
    this.state.brickgames.currentRound += 1
    let newProblem
    if (this.state.brickgames.currentRound === 1) {
      newProblem = {
        problemId: 3,
        problemType: QUIZ_TYPE.SAME2,
        generateKey: 'middle',
      }
    } else {
      newProblem = {
        problemId: 10,
        problemType: QUIZ_TYPE.DIFF3,
        generateKey: 2,
      }
    }
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
      value.playerStatus.currentImages.splice(0, value.playerStatus.currentImages.length)
      this.state.brickgames.problemImages.forEach((elem) => {
        value.playerStatus.currentImages.push(elem)  
      })
    })

    this.broadcastGameState()
    this.clients.map((value) => {
      this.broadcastPlayerUpdate(value)
    })
  }

  /* 라운드 내용을 초기화 */
  endRound() {
    // this.state.brickgames.hasRoundWinner = false
    // this.state.brickgames.roundWinner
    this.state.brickgames.problemId = 0
    this.state.brickgames.problemType = QUIZ_TYPE.NONE
    this.state.brickgames.problemImages.splice(0, this.state.brickgames.problemImages.length)
    this.state.brickgames.brickPlayers.forEach((value) => {
      value.playerStatus.currentImages.splice(0, value.playerStatus.currentImages.length)
      value.playerStatus.selectedOption = DATA_STRUCTURE.NONE
      value.playerStatus.commandArray.splice(0, value.playerStatus.commandArray.length)
    })

    this.broadcastGameState()
    this.clients.map((value) => {
      this.broadcastPlayerUpdate(value)
    })
  }

  /* End the game by kicking users out leading to autodiapose */
  endGame() {
    if (!this.state.brickgames.gameInProgress) {
      return
    }

    this.state.brickgames.gameInProgress = false
    this.state.brickgames.hasRoundWinner = false
    this.state.brickgames.roundWinner = ''
    this.broadcastGameState()

    setTimeout(() => {
      for (const client of this.clients.values()) {
        client.leave()
      }
    }, 3000)
  }

  onDispose() {
    console.log('room', this.roomId, 'disposing...')
    this.dispatcher.stop()
  }

  getRandomProblem() {
    const randomIndex = Math.floor(Math.random() * ProblemTypes.length);
    return ProblemTypes[randomIndex];
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