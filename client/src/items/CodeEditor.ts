import { ItemType } from '../../../types/Items'
import store from '../stores'
import Item from './Item'
// import Network from '../services/Network'
import { openCodeEditorDialog } from '../stores/CodeEditorStore'

export default class CodeEditor extends Item {
  id?: string
  currentUsers = new Set<string>()

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)

    this.itemType = ItemType.CODEEDITOR
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
      this.setDialogBox('Press Q to use code editor')
    } else {
      this.setDialogBox('Press Q join')
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

  // openDialog(network: Network) {
  //   if (!this.id) return
  //   store.dispatch(openCodeEditorDialog(this.id))
  //   network.connectToWhiteboard(this.id)
  // }

  openDialog() {
    if (!this.id) return
    store.dispatch(openCodeEditorDialog(this.id))
  }
}
