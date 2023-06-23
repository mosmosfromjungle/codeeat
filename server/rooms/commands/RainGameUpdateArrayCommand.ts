import { Command } from '@colyseus/command'
import { Client } from 'colyseus'
import { IOfficeState } from '../../../types/IOfficeState'

type Payload = {
  client: Client
  RainGameId: string
}

export class RainGameAddUserCommand extends Command<IOfficeState, Payload> {
  execute(data: Payload) {
    const { client, RainGameId } = data
    const RainGame = this.room.state.RainGames.get(RainGameId)
    const clientId = client.sessionId

    if (!RainGame || RainGame.connectedUser.has(clientId)) return
    RainGame.connectedUser.add(clientId)
  }
}

export class RainGameRemoveUserCommand extends Command<IOfficeState, Payload> {
  execute(data: Payload) {
    const { client, RainGameId } = data
    const RainGame = this.state.RainGames.get(RainGameId)

    if (RainGame.connectedUser.has(client.sessionId)) {
      RainGame.connectedUser.delete(client.sessionId)
    }
  }
}
