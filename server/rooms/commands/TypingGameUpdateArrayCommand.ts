import { Command } from '@colyseus/command'
import { Client } from 'colyseus'
import { IOfficeState } from '../../../types/IOfficeState'

type Payload = {
  client: Client
  typinggameId: string
}

export class TypingGameAddUserCommand extends Command<IOfficeState, Payload> {
  execute(data: Payload) {
    const { client, typinggameId } = data
    const typinggame = this.room.state.typinggames.get(typinggameId)
    const clientId = client.sessionId

    if (!typinggame || typinggame.connectedUser.has(clientId)) return
    typinggame.connectedUser.add(clientId)
  }
}

export class TypingGameRemoveUserCommand extends Command<IOfficeState, Payload> {
  execute(data: Payload) {
    const { client, typinggameId } = data
    const typinggame = this.state.typinggames.get(typinggameId)

    if (typinggame.connectedUser.has(client.sessionId)) {
      typinggame.connectedUser.delete(client.sessionId)
    }
  }
}
