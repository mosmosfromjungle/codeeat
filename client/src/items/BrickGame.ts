import { ItemType } from '../../../types/Items'
import store from '../stores'
import Item from './Item'
import Network from '../services/Network'
import { openBrickGameDialog } from '../stores/BrickGameStore'
import { DIALOG_STATUS, setDialogStatus } from '../stores/UserStore'


export default class BrickGame extends Item {
  // id?: string
  currentUsers = new Set<string>()

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)

    this.itemType = ItemType.BRICKGAME
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
      this.setDialogBox('Press R to play the Brick Game')
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


  openDialog(network: Network) {  // TODO: 아이템 별로 별도의 방을 만든다면 gameNetwork가 아닌 network의 room에서 정원이 다 찼는지 여부를 관리해줘야 함 
    // if (!this.id) return
    store.dispatch(openBrickGameDialog())
    store.dispatch(setDialogStatus(DIALOG_STATUS.GAME_LOBBY))
    // network.connectToBrickGame(this.id)  // TODO: 서버에 해당 클라이언트가 몇번 아이디의 해당 아이템에 연결했는지 정보 전달 -> 나중에 아이템 별로 연결하고자 할 때 살려야 함 
  }
}