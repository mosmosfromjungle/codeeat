import { Command } from '@colyseus/command'
import { Client } from 'colyseus'
import { IOfficeState } from '../../../types/IOfficeState'

type Payload = {
  client: Client
  name: string
  character: string
  point: string
  problem: string
}

export class MoleGameGetUserInfo extends Command<IOfficeState, Payload> {
  execute(data: Payload) {
    const { client, name, character } = data
  }
}

export class MoleGameAddPoint extends Command<IOfficeState, Payload> {
  execute(data: Payload) {
    const { client, point } = data
  }
}

export class MoleGameProblems extends Command<IOfficeState, Payload> {
  execute(data: Payload) {
    const { client, problem } = data
  }
}