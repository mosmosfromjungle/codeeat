import { Command } from '@colyseus/command'
import { Client } from 'colyseus'
import { IOfficeState } from '../../../types/IOfficeState'

type Payload = {
  client: Client
  acidrainId: string
}

export class AcidRainAddUserCommand extends Command<IOfficeState, Payload> {
  execute(data: Payload) {
    const { client, acidrainId } = data
    const acidrain = this.room.state.acidrains.get(acidrainId)
    const clientId = client.sessionId

    if (!acidrain || acidrain.connectedUser.has(clientId)) return
    acidrain.connectedUser.add(clientId)
  }
}

export class AcidRainRemoveUserCommand extends Command<IOfficeState, Payload> {
  execute(data: Payload) {
    const { client, acidrainId } = data
    const acidrain = this.state.acidrains.get(acidrainId)

    if (acidrain.connectedUser.has(client.sessionId)) {
      acidrain.connectedUser.delete(client.sessionId)
    }
  }
}
