import { Command } from '@colyseus/command'
import { Client } from 'colyseus'
import { IOfficeState } from '../../../../types/IOfficeState'

type Payload = {
  client: Client
  rainGameId: string
}

export class RainGameAddUserCommand extends Command<IOfficeState, Payload> {
  execute(data: Payload) {
    const { client, rainGameId } = data
    const RainGame = this.room.state.raingames.get(rainGameId)
    const clientId = client.sessionId

    if (!RainGame || RainGame.connectedUser.has(clientId)) return
    RainGame.connectedUser.add(clientId)
  }
}

export class RainGameRemoveUserCommand extends Command<IOfficeState, Payload> {
  execute(data: Payload) {
    const { client, rainGameId } = data
    const raingame = this.state.raingames.get(rainGameId)

    if (raingame.connectedUser.has(client.sessionId)) {
      raingame.connectedUser.delete(client.sessionId)
    }
  }
}
