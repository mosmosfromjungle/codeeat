import { ItemType } from '../../../types/Items'
import store from '../stores'
import Item from './Item'
import Network from '../services/Network'
import { openRainGameDialog } from '../stores/RainGameDialogStore'
import { DIALOG_STATUS, setDialogStatus } from '../stores/UserStore'
import Bootstrap from '../scenes/Bootstrap'
import phaserGame from '../PhaserGame'
import { RoomType } from '../../../types/Rooms'


export default class RainGame extends Item {
  // id?: string
  currentUsers = new Set<string>()

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)

    this.itemType = ItemType.RAINGAME
  }

  private updateStatus() {
    if (!this.currentUsers) return
    const numberOfUsers = this.currentUsers.size
    this.clearStatusBox()
    if (numberOfUsers === 1) {
      this.setStatusBox(`${numberOfUsers} user`)
    } else if (numberOfUsers > 1) {
      this.setStatusBox(`${numberOfUsers} users`)
    }
  }

  onOverlapDialog() {
    if (this.currentUsers.size === 0) {
      this.setDialogBox('Press R to play the RainGame')
    } else {
      this.setDialogBox('Press R join')
    }
  }

  addCurrentUser(userId: string) {
    if (!this.currentUsers || this.currentUsers.has(userId)) return
    this.currentUsers.add(userId)
    this.updateStatus()
  }

  removeCurrentUser(userId: string) {
    if (!this.currentUsers || !this.currentUsers.has(userId)) return
    this.currentUsers.delete(userId)
    this.updateStatus()
  }

  openDialog(network: Network) {
    // if (!this.id) return
    const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
    bootstrap.gameNetwork.joinLobbyRoom(RoomType.RAINLOBBY)
    store.dispatch(openRainGameDialog())
    // network.connectToRainGame(this.id)

    setTimeout(() => {
      store.dispatch(setDialogStatus(DIALOG_STATUS.GAME_LOBBY))
    }, 200)
  }
}
