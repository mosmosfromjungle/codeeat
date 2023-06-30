import { Command } from '@colyseus/command'
import { Client } from 'colyseus'
import { IGameState, DATA_STRUCTURE } from '../../../types/IGameState'

type Payload = {

}

export default class BrickGameCommand extends Command<IGameState, Payload> {
  
  execute(data: Payload) {
    const {  } = data

    const player = this.room.state.brickgames.brickPlayers.get(client.sessionId)
    if (!player) return


    

  }
}
