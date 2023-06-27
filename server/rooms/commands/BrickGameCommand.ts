import { Command } from '@colyseus/command'
import { Client } from 'colyseus'
import { IGameState, DATA_STRUCTURE } from '../../../types/IGameState'

type Payload = {
  client: Client
  command: string
  commandText: string
  index?: number
}

export default class BrickGameCommand extends Command<IGameState, Payload> {
  
  execute(data: Payload) {
    const { client, command, commandText, index } = data

    const player = this.room.state.brickgames.brickPlayers.get(client.sessionId)
    if (!player) return

    const playerStatus = player.playerStatus

    if (command === 'restore') {
      playerStatus.currentImages.splice(0, playerStatus.currentImages.length, ...this.state.brickgames.originalImages)
    } 
    if (command === 'reset') {
      playerStatus.selectedOption = DATA_STRUCTURE.NONE
      playerStatus.currentImages.splice(0, playerStatus.currentImages.length, ...this.state.brickgames.originalImages)
      playerStatus.commandArray.clear
    }
    if (command === 'remove') {
      playerStatus.currentImages.splice(index!, 1)
      playerStatus.commandArray.push(commandText)
    }
    if (command === DATA_STRUCTURE.LIST) {
      playerStatus.selectedOption = DATA_STRUCTURE.LIST
      playerStatus.commandArray.push(commandText)
      console.log('======', commandText)
    }
    if (command === DATA_STRUCTURE.SET) {
      playerStatus.selectedOption = DATA_STRUCTURE.SET
      playerStatus.commandArray.push(commandText)
    }
    if (command === DATA_STRUCTURE.STACK) {
      playerStatus.selectedOption = DATA_STRUCTURE.STACK
      playerStatus.commandArray.push(commandText)
    }
    if (command === DATA_STRUCTURE.QUEUE) {
      playerStatus.selectedOption = DATA_STRUCTURE.QUEUE
      playerStatus.commandArray.push(commandText)
    }
    if (command === DATA_STRUCTURE.DEQUE) {
      playerStatus.selectedOption = DATA_STRUCTURE.DEQUE
      playerStatus.commandArray.push(commandText)
    }
  }
}

        // case DATA_STRUCTURE.LIST:

        // case DATA_STRUCTURE.SET:

        // case DATA_STRUCTURE.STACK:

        // case DATA_STRUCTURE.QUEUE:

        // case DATA_STRUCTURE.DEQUE:

        // default: