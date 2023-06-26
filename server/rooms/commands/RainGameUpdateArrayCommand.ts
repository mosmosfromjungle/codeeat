import { Command } from '@colyseus/command'
import { Client } from 'colyseus'
import { IKeywordRain, IOfficeState, IPlayer } from '../../../types/IOfficeState'
import { type } from "@colyseus/schema";
import { Schema } from "@colyseus/schema";
import { ArraySchema } from "@colyseus/schema";

type Payload = {
  client: Client
  rainGameId: string
}

export class RainGameAddUserCommand extends Command<IOfficeState, Payload> {
  execute(data: Payload) {
    const { client, rainGameId } = data
    const RainGame = this.room.state.raingames.get(rainGameId)
    const clientId = client.sessionId

  if (!RainGame || RainGame.connectedUser.has(clientId)) return;

  const player: IPlayer | undefined = this.room.state.players.get(clientId);

  if(player){
    const playerName = player.name;
    const playerAnim = player.anim;
    console.log(`Player Name: ${playerName}, Player Animation: ${playerAnim}`)
  }

  RainGame.connectedUser.add(clientId);
  }
}

export class RainGameRemoveUserCommand extends Command<IOfficeState, Payload> {
  execute(data: Payload) {
    const { client, rainGameId } = data
    const raingame = this.state.raingames.get(rainGameId)

    if (raingame.connectedUser.has(client.sessionId)) {
      raingame.connectedUser.delete(client.sessionId)
    }
  }
}