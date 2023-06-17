import { Command } from '@colyseus/command'
import { Client } from 'colyseus'
import { IOfficeState } from '../../../types/IOfficeState'

type Payload = {
  client: Client
  moleGameId: string
}

export class MoleGameAddUserCommand extends Command<IOfficeState, Payload> {
  execute(data: Payload) {
    const { client, moleGameId } = data
    const molegame = this.room.state.molegames.get(moleGameId)
    const clientId = client.sessionId

    if (!molegame || molegame.connectedUser.has(clientId)) return
    molegame.connectedUser.add(clientId)
  }
}

export class MoleGameRemoveUserCommand extends Command<IOfficeState, Payload> {
  execute(data: Payload) {
    const { client, moleGameId } = data
    const molegame = this.state.molegames.get(moleGameId)

    if (molegame.connectedUser.has(client.sessionId)) {
      molegame.connectedUser.delete(client.sessionId)
    }
  }
}
