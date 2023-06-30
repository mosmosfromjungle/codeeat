import bcrypt from 'bcrypt'
import { Room, Client, ServerError } from 'colyseus'
import { Dispatcher } from '@colyseus/command'
import { Message } from '../../types/Messages'
import { IGameRoomData } from '../../types/Rooms'
import {
  KeywordRain,
  RainGameState,
  RainGameUser,
  RainGameRoomState,
} from './schema/GameState'
import { RainGameStartCommand } from './commands/RainGameStartCommand'
import {
  IRainGameRoomState,
  IKeywordRain,
} from '../../types/IGameState'
import mongoose from 'mongoose'
import MapSchema from '@colyseus/schema'

export class RainGameRoom extends Room<IRainGameRoomState> {
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
    this.setState(new RainGameRoomState())
    this.state.host = username

    this.onMessage(Message.RAIN_GAME_START, (client, content) =>
      this.handleRainGameStart(client, content)
    )
    this.onMessage(Message.RAIN_GAME_WORD, (client, content) =>
      this.handleRainGameWord(this)
    )
    this.onMessage(Message.RAIN_GAME_USER, (client, data) => this.handleRainGameUser(client, data))
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
    this.state.rainGameStates.set(client.sessionId, new RainGameState(username))
    client.send(Message.SEND_ROOM_DATA, {
      id: this.roomId,
      name: this.name,
      description: this.description,
    })
    if(this.clients.length === 2){
      this.state.rainGameReady = true
      this.broadcast(Message.RAIN_GAME_READY)
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
    this.state.rainGameInProgress = true
    this.handleRainGameWord(this)
  }

  // Handle RAIN_GAME_USER message
  private handleRainGameUser(client: Client, data: any) {
    console.log('handleRainGameUser')
    const { username, character } = data

    this.state.rainGameUsers.set(client.sessionId, new RainGameUser(username,character))

    this.broadcast(Message.RAIN_GAME_USER, this.state.rainGameUsers)
  }

  // Handle RAIN_GAME_WORD message
  private handleRainGameWord( room: Room) {
    console.log('handleRainGameWord')
    try {

      room.clients.forEach((client) => {
        const keywordRainList = this.MakeWordCommand()
        this.state.keywordLists.set(client.sessionId, keywordRainList)
      })

      // Broadcast the two lists
      this.broadcast(Message.RAIN_GAME_START, this.state.keywordLists)
    
    } catch (error) {
      console.error('Failed to generate keywords:', error)
    }
  }

  MakeWordCommand(): MapSchema<IKeywordRain>  {
    try {
        console.log('MakeWordCommand')
        const raingamewords = mongoose.connection.collection('raingamewords')
        
        let keywordsList: new MapSchema<IKeywordRain>()
        
        raingamewords.aggregate([]).toArray().then(allWords => {
         allWords.forEach((word: any) => {
          const keywordRain = new MapSchema<KeywordRain>(word)
          keywordRain.y = 10
          keywordRain.speed = 1
          keywordRain.x = Math.floor(Math.random() * (550 - 50 + 1)) + 50
          keywordsList.set(keywordRain.keyword,keywordRain) 
        });
      });
        return keywordsList;
      } catch (error) {
        console.error('Failed to generate keywords:', error)    
     }
  }
}
