import { Command } from '@colyseus/command'
import { Client } from 'colyseus'
import { IGameState } from '../../../types/IGameState'

type Payload = {
  clientId: string;
  username: string
  character: string
}

export default class RainGameUserUpdateCommand extends Command<IGameState, Payload> {
  execute(data: Payload) {
    const { clientId, username, character } = data

    const player = this.room.state.raingames.get(clientId)
    console.log("문제점은여기다")
    console.log(player)

    if (!player) return

    // Update the username and character of the player
    player.username = username
    player.character = character
  }
}