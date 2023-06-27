import { Command } from '@colyseus/command'
import { Client } from 'colyseus'
import { IGameState } from '../../../types/IGameState'

type Payload = {
  client: Client
  username: string
  character: string
}

export default class RainGameUserUpdateCommand extends Command<IGameState, Payload> {
  execute(data: Payload) {
    const { client, username, character } = data

    const player = this.room.state.players.get(client.sessionId)

    if (!player) return

    // Update the username and character of the player
    player.username = username
    player.character = character
  }
}