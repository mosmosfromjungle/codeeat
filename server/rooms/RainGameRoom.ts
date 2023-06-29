import bcrypt from 'bcrypt'
import { Room, Client, ServerError } from 'colyseus'
import { Dispatcher } from '@colyseus/command'
import { Message } from '../../types/Messages'
import { IGameRoomData } from '../../types/Rooms'
import { KeywordRain, GameState, GamePlayer, RainGameState, RainGameUser, RainGameRoomState } from './schema/GameState'
import { MakeWordCommand } from './commands/RainGameMakeWordCommand'
import { RainGameStartCommand } from './commands/RainGameStartCommand'
import { IRainGameRoomState, IRainGameState , IKeywordRain, IRainGameUser } from '../../types/IGameState'
import { ArraySchema } from '@colyseus/schema'

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

      this.onMessage(Message.RAIN_GAME_START, (client, content) => this.handleRainGameStart(client, content));
      this.onMessage(Message.RAIN_GAME_WORD, (client, content) => this.handleRainGameWord(client, content));
      this.onMessage(Message.RAIN_GAME_USER, (client, data) => this.handleRainGameUser(client, data));  
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
      this.onMessage(Message.RAIN_GAME_START, (client, content) => this.handleRainGameStart(client, content));
      this.onMessage(Message.RAIN_GAME_WORD, (client, content) => this.handleRainGameWord(client, content));
      this.onMessage(Message.RAIN_GAME_USER, (client, data) => this.handleRainGameUser(client, data));

      }

  
    onLeave(client: Client, consented: boolean) {

    }

    
    
    onDispose() {
      console.log('room', this.roomId, 'disposing...')
      this.dispatcher.stop()
    }
    // Handle RAIN_GAME_START message
  private handleRainGameStart(client: Client, content: any) {
    console.log("9")
      this.dispatcher.dispatch(new RainGameStartCommand(), { client });
      this.dispatcher.dispatch(new MakeWordCommand(), { room: this, clientId: client.sessionId });
      this.broadcast(
          Message.RAIN_GAME_START,
          Array.from(this.state.rainGameStates).reduce((obj, [key, value]) => ((obj[key] = value), obj), {})
      );
  }

  // Handle RAIN_GAME_USER message
  private handleRainGameUser(client: Client, data: any) {
    const { clientId, username, character } = data;
    console.log("4")

    const newRainGameState = new RainGameState();
    newRainGameState.owner = clientId;

    const newRainGameUser = new RainGameUser();
    newRainGameUser.username = username;
    newRainGameUser.character = character;
    newRainGameUser.clientId = clientId;

    this.state.rainGameUsers.set(clientId, newRainGameUser);
    this.state.rainGameStates.set(clientId, newRainGameState);

    const payload = {
        clientId,
        username,
        character,
    };

    const rainGameUser = this.state.rainGameUsers.get(clientId);
    if (rainGameUser) {
        rainGameUser.username = username;
        rainGameUser.character = character;
    }

    this.broadcast(Message.RAIN_GAME_USER, payload);
}

  // Handle RAIN_GAME_WORD message
  private handleRainGameWord(client: Client, content: any) {
    this.startGeneratingKeywords(client);
  }
 
  private startGeneratingKeywords(client) {
      const clientId = client.sessionId
      const generateKeywords = async () => {
        try {
          await this.dispatcher.dispatch(new MakeWordCommand(), { room: this, clientId: clientId });
    
          this.state.rainGameStates.forEach((RainGameState, owner) => {
            this.broadcast(Message.RAIN_GAME_WORD, RainGameState);
          });
          
          // Schedule the next execution
          setTimeout(generateKeywords, 2000);
        } catch (error) {
          console.error('Failed to generate keywords:', error);
        }
      }
      // Start the first execution
      generateKeywords();
    }
  }
  