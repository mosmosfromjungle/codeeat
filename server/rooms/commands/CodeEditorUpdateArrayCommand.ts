import { Command } from '@colyseus/command'
import { Client } from 'colyseus'
import { IOfficeState } from '../../../types/IOfficeState'

type Payload = {
  client: Client
  codeEditorId: string
}

export class CodeEditorAddUserCommand extends Command<IOfficeState, Payload> {
  execute(data: Payload) {
    const { client, codeEditorId } = data
    const codeeditor = this.room.state.codeeditors.get(codeEditorId)
    const clientId = client.sessionId

    if (!codeeditor || codeeditor.connectedUser.has(clientId)) return
    codeeditor.connectedUser.add(clientId)
  }
}

export class CodeEditorRemoveUserCommand extends Command<IOfficeState, Payload> {
  execute(data: Payload) {
    const { client, codeEditorId } = data
    const codeeditor = this.state.codeeditors.get(codeEditorId)

    if (codeeditor.connectedUser.has(client.sessionId)) {
      codeeditor.connectedUser.delete(client.sessionId)
    }
  }
}
