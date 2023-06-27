import { Command } from '@colyseus/command'
import { Client } from 'colyseus'
import { IOfficeState } from '../../../../types/IOfficeState'

type Payload = {
  client: Client
  brickGameId: string
}

export class BrickGameAddUserCommand extends Command<IOfficeState, Payload> {
  execute(data: Payload) {
    const { client, brickGameId } = data
    const brickgame = this.room.state.brickgames.get(brickGameId)
    const clientId = client.sessionId

    if (!brickgame || brickgame.connectedUser.has(clientId)) return
    brickgame.connectedUser.add(clientId)
  }
}

export class BrickGameRemoveUserCommand extends Command<IOfficeState, Payload> {
  execute(data: Payload) {
    const { client, brickGameId } = data
    const brickgame = this.state.brickgames.get(brickGameId)

    if (brickgame.connectedUser.has(client.sessionId)) {
      brickgame.connectedUser.delete(client.sessionId)
    }
  }
}
