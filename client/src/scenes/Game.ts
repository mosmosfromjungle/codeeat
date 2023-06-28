import Phaser from 'phaser'

// import { debugDraw } from '../utils/debug'
import Network from '../services/Network'
import Network2 from '../services/Network2'
// import GameNetwork from '../services/GameNetwork'

import Item from '../items/Item'
import Chair from '../items/Chair'
import MoleGame from '../items/MoleGame'
import BrickGame from '../items/BrickGame'
import RainGame from '../items/RainGame'
import FaceChat from '../items/FaceChat'
import { ItemType } from '../../../types/Items'

import '../players/MyPlayer'
import '../players/OtherPlayer'
import MyPlayer from '../players/MyPlayer'
import OtherPlayer from '../players/OtherPlayer'
import PlayerSelector from '../players/PlayerSelector'
import { IPlayer } from '../../../types/IOfficeState'
import { PlayerBehavior } from '../../../types/PlayerBehavior'
import { createCharacterAnims } from '../anims/CharacterAnims'

import store from '../stores'
import { setFocused, setShowChat } from '../stores/ChatStore'
import { setShowDMList, setShowDM, setShowDMRoom } from '../stores/DMStore'
import { NavKeys, Keyboard } from '../../../types/KeyboardState'

export default class Game extends Phaser.Scene {
  network!: Network
  network2!: Network2
  private cursors!: NavKeys
  private keyE!: Phaser.Input.Keyboard.Key
  private keyR!: Phaser.Input.Keyboard.Key
  private map!: Phaser.Tilemaps.Tilemap
  myPlayer!: MyPlayer
  private playerSelector!: Phaser.GameObjects.Zone
  private otherPlayers!: Phaser.Physics.Arcade.Group
  private otherPlayerMap = new Map<string, OtherPlayer>()
  private brickgameMap = new Map<String, BrickGame>()
  private molegameMap = new Map<String, MoleGame>()
  private raingameMap = new Map<string, RainGame>()
  facechatMap = new Map<String, FaceChat>()

  constructor() {
    super('game')
  }

  registerKeys() {
    this.cursors = {
      ...this.input.keyboard.createCursorKeys(),
      ...(this.input.keyboard.addKeys('W,S,A,D') as Keyboard),
    }

    // maybe we can have a dedicated method for adding keys if more keys are needed in the future
    this.keyE = this.input.keyboard.addKey('E')
    this.keyR = this.input.keyboard.addKey('R')
    this.input.keyboard.disableGlobalCapture()
    this.input.keyboard.on('keydown-ENTER', (event) => {
      store.dispatch(setShowChat(true))
      store.dispatch(setFocused(true))
    })
    this.input.keyboard.on('keydown-ESC', (event) => {
      store.dispatch(setShowChat(false))
      store.dispatch(setShowDM(false))
      // store.dispatch(setShowDMRoom(false))
      store.dispatch(setShowDMList(false))
    })
  }

  disableKeys() {
    this.input.keyboard.enabled = false
  }

  enableKeys() {
    this.input.keyboard.enabled = true
  }

  create(data: { network: Network }) {
    if (!data.network) {
      throw new Error('server instance missing')
    } else {
      this.network = data.network
    }

    createCharacterAnims(this.anims)

    this.map = this.make.tilemap({ key: 'tilemap' })

    // ************************************** (codeEat) //
    // const FloorAndGround = this.map.addTilesetImage('FloorAndGround', 'tiles_wall')

    // const groundLayer = this.map.createLayer('Ground', FloorAndGround)
    // groundLayer.setCollisionByProperty({ collides: true })
    // ******************************* //

    const buildingsImage = this.map.addTilesetImage('buildings', 'buildings')
    const foregroundImage = this.map.addTilesetImage('foreground', 'foreground')
    const groundImage = this.map.addTilesetImage('ground', 'ground')
    const secondlayerImage = this.map.addTilesetImage('secondlayer', 'secondlayer')
    const shadowImage = this.map.addTilesetImage('shadow', 'shadow')
    const wallImage = this.map.addTilesetImage('wall', 'wall')

    this.map.createLayer('ground', [groundImage])
    this.map.createLayer('wall', [wallImage])
    this.map.createLayer('shadow', [shadowImage])

    const buildingsLayer = this.map.createLayer('buildings', [buildingsImage])
    const secondGroundLayer = this.map.createLayer('secondground', [secondlayerImage])
    const fenceLayer = this.map.createLayer('fence', [secondlayerImage])
    const foreGroundLayer = this.map.createLayer('foreground', [foregroundImage])

    // thirdGroundLayer.setDepth(6500)
    foreGroundLayer.setDepth(6000)
    secondGroundLayer.setCollisionByProperty({ collisions: true })
    fenceLayer.setCollisionByProperty({ collisions: true })

    // debugDraw(groundLayer, this)

    /*
      // ***새롭게 16px 캐릭터로 변경하기 위한 코드***
      this.myPlayer = this.add.myPlayer(
      Phaser.Math.RND.between(400, 900),
      Phaser.Math.RND.between(400, 900),
      'kevin',
      this.network.mySessionId,
      // userId,
      // userProfile
      // 로건 케빈 엠마
    );
    */

    // this.myPlayer = this.add.myPlayer(400, 900, 'kevin', this.network.mySessionId)
    this.myPlayer = this.add.myPlayer(705, 500, 'adam', this.network.mySessionId) // TODO: 캐릭터 시작 위치 수정 가능 -> 서버와 통일해야함
    this.playerSelector = new PlayerSelector(this, 0, 0, 32, 32)  // TODO: 아이템과 상호작용할 수 있는 면적 
    console.log('game scene created')
    console.log('set my player initial setting ', this.myPlayer)


    const chairs = this.physics.add.staticGroup({ classType: Chair })
    const chairLayer = this.map.getObjectLayer('chair')
    chairLayer.objects.forEach((Obj) => {
      const item = this.addObjectFromTiled(chairs, Obj, 'codeEatChair', 'codeEatChair') as Chair
      // custom properties[0] is the object direction specified in Tiled
      item.itemDirection = Obj.properties[0].value
    })

    /* Brick Game */
    const brickgames = this.physics.add.staticGroup({ classType: BrickGame })
    const brickgameLayer = this.map.getObjectLayer('playground')
    brickgameLayer.objects.forEach((obj, i) => {
      const item = this.addObjectFromTiled(brickgames, obj, 'picnic2', 'picnic2') as BrickGame
      // item.setDepth(item.y + item.height * 0.27)
      const id = `${i}`
      // item.id = id   // TODO: 나중에 아이템 별로 지정된 별도의 방에 들어가게 하기 위해 필요 
      this.brickgameMap.set(id, item)
    })

    /* Rain Game */
    const raingames = this.physics.add.staticGroup({ classType: RainGame })
    const raingameLayer = this.map.getObjectLayer('bench')
    raingameLayer.objects.forEach((obj, i) => {
      const item = this.addObjectFromTiled(raingames, obj, 'bench', 'bench') as RainGame
      const id = `${i}`
      item.id = id
      this.raingameMap.set(id, item)
    })

    /* Mole Game */
    const molegames = this.physics.add.staticGroup({ classType: MoleGame })
    const molegameLayer = this.map.getObjectLayer('mole')
    molegameLayer.objects.forEach((obj, i) => {
      const item = this.addObjectFromTiled(molegames, obj, 'mole', 'mole') as MoleGame
      const id = `${i}`
      item.id = id
      this.molegameMap.set(id, item)
    })

    /* Face Chat */
    const facechats = this.physics.add.staticGroup({ classType: FaceChat })
    const facechatLayer = this.map.getObjectLayer('facechat')
    facechatLayer.objects.forEach((obj, i) => {
      const item = this.addObjectFromTiled(facechats, obj, 'bench', 'bench') as FaceChat
      const id = `${i}`
      item.faceChatId = id
      this.facechatMap.set(id, item)
    })

    // ************************************** (codeEat) //

    // // import other objects from Tiled map to Phaser
    // this.addGroupFromTiled('Wall', 'tiles_wall', 'FloorAndGround', false)
    // this.addGroupFromTiled('Objects', 'office', 'Modern_Office_Black_Shadow', false)
    // this.addGroupFromTiled('ObjectsOnCollide', 'office', 'Modern_Office_Black_Shadow', true)
    // this.addGroupFromTiled('GenericObjects', 'generic', 'Generic', false)
    // this.addGroupFromTiled('GenericObjectsOnCollide', 'generic', 'Generic', true)
    // this.addGroupFromTiled('Basement', 'basement', 'Basement', true)

    this.otherPlayers = this.physics.add.group({ classType: OtherPlayer })

    this.cameras.main.zoom = 1.5
    this.cameras.main.startFollow(this.myPlayer, true)
    this.physics.add.collider([this.myPlayer, this.myPlayer.playerContainer], secondGroundLayer)
    this.physics.add.collider([this.myPlayer, this.myPlayer.playerContainer], fenceLayer)

    this.physics.add.overlap(
      this.playerSelector,
      [chairs, molegames, raingames, brickgames, facechats],
      this.handleItemSelectorOverlap,
      undefined,
      this
    )

    this.physics.add.overlap(
      this.myPlayer,
      this.otherPlayers,
      this.handlePlayersOverlap,
      undefined,
      this
    )

    // register network event listeners
    this.network.onPlayerJoined(this.handlePlayerJoined, this)
    this.network.onPlayerLeft(this.handlePlayerLeft, this)
    this.network.onMyPlayerReady(this.handleMyPlayerReady, this)
    this.network.onMyPlayerVideoConnected(this.handleMyVideoConnected, this)
    this.network.onPlayerUpdated(this.handlePlayerUpdated, this)
    this.network.onItemUserAdded(this.handleItemUserAdded, this)
    this.network.onItemUserRemoved(this.handleItemUserRemoved, this)
    this.network.onChatMessageAdded(this.handleChatMessageAdded, this)
  }

  private handleItemSelectorOverlap(playerSelector, selectionItem) {
    const currentItem = playerSelector.selectedItem as Item
    // currentItem is undefined if nothing was perviously selected
    if (currentItem) {
      // if the selection has not changed, do nothing
      if (currentItem === selectionItem || currentItem.depth >= selectionItem.depth) {
        return
      }
      // if selection changes, clear pervious dialog
      if (this.myPlayer.playerBehavior !== PlayerBehavior.SITTING) currentItem.clearDialogBox()
    }

    // set selected item and set up new dialog
    playerSelector.selectedItem = selectionItem
    selectionItem.onOverlapDialog()
  }

  private addObjectFromTiled(
    group: Phaser.Physics.Arcade.StaticGroup,
    object: Phaser.Types.Tilemaps.TiledObject,
    key: string,
    tilesetName: string
  ) {
    const actualX = object.x! + object.width! * 0.5
    const actualY = object.y! - object.height! * 0.5
    const obj = group
      .get(actualX, actualY, key, object.gid! - this.map.getTileset(tilesetName).firstgid)
      .setDepth(actualY * 0.5)
    return obj
  }

  private addGroupFromTiled(
    objectLayerName: string,
    key: string,
    tilesetName: string,
    collidable: boolean
  ) {
    const group = this.physics.add.staticGroup()
    const objectLayer = this.map.getObjectLayer(objectLayerName)
    objectLayer.objects.forEach((object) => {
      const actualX = object.x! + object.width! * 0.5
      const actualY = object.y! - object.height! * 0.5
      group
        .get(actualX, actualY, key, object.gid! - this.map.getTileset(tilesetName).firstgid)
        .setDepth(actualY)
    })
    if (this.myPlayer && collidable)
      this.physics.add.collider([this.myPlayer, this.myPlayer.playerContainer], group)
  }

  // function to add new player to the otherPlayer group
  private handlePlayerJoined(newPlayer: IPlayer, id: string) {
    const otherPlayer = this.add.otherPlayer(newPlayer.x, newPlayer.y, 'adam', id, newPlayer.name)
    this.otherPlayers.add(otherPlayer)
    this.otherPlayerMap.set(id, otherPlayer)
  }

  // function to remove the player who left from the otherPlayer group
  private handlePlayerLeft(id: string) {
    if (this.otherPlayerMap.has(id)) {
      const otherPlayer = this.otherPlayerMap.get(id)
      if (!otherPlayer) return
      this.otherPlayers.remove(otherPlayer, true, true)
      this.otherPlayerMap.delete(id)
    }
  }

  private handleMyPlayerReady() {
    this.myPlayer.readyToConnect = true
  }

  private handleMyVideoConnected() {
    this.myPlayer.videoConnected = true
  }

  // function to update target position upon receiving player updates
  private handlePlayerUpdated(field: string, value: number | string, id: string) {
    const otherPlayer = this.otherPlayerMap.get(id)
    otherPlayer?.updateOtherPlayer(field, value)
  }

  private handlePlayersOverlap(myPlayer, otherPlayer) {
    otherPlayer.makeCall(myPlayer, this.network?.webRTC)
  }

  private handleItemUserAdded(playerId: string, itemId: string, itemType: ItemType) {
    if (itemType === ItemType.BRICKGAME) {
      const brickgame = this.brickgameMap.get(itemId)
      brickgame?.addCurrentUser(playerId)
    } else if (itemType === ItemType.RAINGAME) {
      const raingame = this.raingameMap.get(itemId)
      raingame?.addCurrentUser(playerId)
    } else if (itemType === ItemType.MOLEGAME) {
      const molegame = this.molegameMap.get(itemId)
      molegame?.addCurrentUser(playerId)
    } else if (itemType === ItemType.FACECHAT) {
      const facechat = this.facechatMap.get(itemId)
      facechat?.addCurrentUser(playerId)
    }
  }

  private handleItemUserRemoved(playerId: string, itemId: string, itemType: ItemType) {
    if (itemType === ItemType.BRICKGAME) {
      const brickgame = this.brickgameMap.get(itemId)
      brickgame?.removeCurrentUser(playerId)
    } else if (itemType === ItemType.RAINGAME) {
      const raingame = this.raingameMap.get(itemId)
      raingame?.removeCurrentUser(playerId)
    } else if (itemType === ItemType.MOLEGAME) {
      const molegame = this.molegameMap.get(itemId)
      molegame?.removeCurrentUser(playerId)
    } else if (itemType === ItemType.FACECHAT) {
      const facechat = this.facechatMap.get(itemId)
      facechat?.removeCurrentUser(playerId)
    }
  }

  private handleChatMessageAdded(playerId: string, content: string) {
    const otherPlayer = this.otherPlayerMap.get(playerId)
    otherPlayer?.updateDialogBubble(content)
  }

  update(t: number, dt: number) {
    if (this.myPlayer && this.network) {
      this.playerSelector.update(this.myPlayer, this.cursors)
      this.myPlayer.update(this.playerSelector, this.cursors, this.keyE, this.keyR, this.network)
    }
  }
}