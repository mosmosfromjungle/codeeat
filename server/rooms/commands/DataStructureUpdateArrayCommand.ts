import { Command } from '@colyseus/command'
import { Client } from 'colyseus'
import { IOfficeState } from '../../../types/IOfficeState'

type Payload = {
  client: Client
  datastructureId: string
}

export class DataStructureAddUserCommand extends Command<IOfficeState, Payload> {
  execute(data: Payload) {
    const { client, datastructureId } = data
    const datastructure = this.room.state.datastructures.get(datastructureId)
    const clientId = client.sessionId

    if (!datastructure || datastructure.connectedUser.has(clientId)) return
    datastructure.connectedUser.add(clientId)
  }
}

export class DataStructureRemoveUserCommand extends Command<IOfficeState, Payload> {
  execute(data: Payload) {
    const { client, datastructureId } = data
    const datastructure = this.state.datastructures.get(datastructureId)

    if (datastructure.connectedUser.has(client.sessionId)) {
      datastructure.connectedUser.delete(client.sessionId)
    }
  }
}
