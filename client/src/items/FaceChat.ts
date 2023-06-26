import { ItemType } from '../../../types/Items'
import store from '../stores'
import Item from './Item'
import Network from '../services/Network'
import { openFaceChatDialog } from '../stores/FaceChatStore'
import { DIALOG_STATUS, setDialogStatus } from '../stores/UserStore'


export default class FaceChat extends Item {
  // id?: string
  faceChatId?: string
  currentUsers = new Set<string>()

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)

    this.itemType = ItemType.MOLEGAME
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
      this.setDialogBox('Press R to play the Face Chat')
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

  openDialog(playerId: string, network: Network) {
    if (!this.faceChatId) return
    store.dispatch(openFaceChatDialog({ faceChatId: this.faceChatId, myUserId: playerId }))
    store.dispatch(setDialogStatus(DIALOG_STATUS.GAME_LOBBY))
    // network.connectToFaceChat(this.id)
  }
}
