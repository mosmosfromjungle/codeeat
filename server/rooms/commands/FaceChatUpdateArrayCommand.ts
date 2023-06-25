import { Command } from '@colyseus/command'
import { Client } from 'colyseus'
import { IOfficeState } from '../../../types/IOfficeState'

type Payload = {
  client: Client
  faceChatId: string
}

export class FaceChatAddUserCommand extends Command<IOfficeState, Payload> {
  execute(data: Payload) {
    const { client, faceChatId } = data
    const facechat = this.room.state.faceChats.get(faceChatId)
    const clientId = client.sessionId

    if (!facechat || facechat.connectedUser.has(clientId)) return
    facechat.connectedUser.add(clientId)
  }
}

export class FaceChatRemoveUserCommand extends Command<IOfficeState, Payload> {
  execute(data: Payload) {
    const { client, faceChatId } = data
    const facechat = this.state.faceChats.get(faceChatId)

    if (facechat.connectedUser.has(client.sessionId)) {
      facechat.connectedUser.delete(client.sessionId)
    }
  }
}
