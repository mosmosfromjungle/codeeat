import Phaser from 'phaser'
import store from '../stores'
import { setRoomJoined } from '../stores/RoomStore'
import { BackgroundMode } from '../../../types/BackgroundMode'
import Network from '../services/Network'
import Network2 from '../services/Network2'
import GameNetwork from '../services/GameNetwork'

export default class Bootstrap extends Phaser.Scene {
  private preloadComplete = false
  network!: Network
  network2!: Network2
  gameNetwork!: GameNetwork

  constructor() {
    super('bootstrap')
  }

  preload() {
    this.load.atlas(
      'cloud_day',
      'assets/background/cloud_day.png',
      'assets/background/cloud_day.json'
    )
    this.load.image('backdrop_day', 'assets/background/backdrop_day.png')
    this.load.atlas(
      'cloud_night',
      'assets/background/cloud_night.png',
      'assets/background/cloud_night.json'
    )
    this.load.image('backdrop_night', 'assets/background/backdrop_night.png')
    this.load.image('sun_moon', 'assets/background/sun_moon.png')

    // this.load.tilemapTiledJSON('tilemap', 'assets/map/map.json')
    this.load.tilemapTiledJSON('tilemap', 'assets/map/codeEatMapFix.json')
    // this.load.spritesheet('tiles_wall', 'assets/map/FloorAndGround.png', {
    //   frameWidth: 32,
    //   frameHeight: 32,
    // })

    // codeEatMapFix //////
    this.load.spritesheet('bench', 'assets/items/bench.png', {
      frameWidth: 16,
      frameHeight: 16,
    })

    this.load.spritesheet('codeEatChair', 'assets/items/codeEatChair.png', {
      frameWidth: 16,
      frameHeight: 16,
    })

    this.load.spritesheet('mole', 'assets/items/mole.png', {
      frameWidth: 16,
      frameHeight: 16,
    })

    this.load.spritesheet('picnic2', 'assets/items/picnic2.png', {
      frameWidth: 16,
      frameHeight: 16,
    })

    this.load.spritesheet('buildings', 'assets/tileset/buildings.png', {
      frameWidth: 16,
      frameHeight: 16,
    })

    this.load.spritesheet('foreground', 'assets/tileset/foreground.png', {
      frameWidth: 16,
      frameHeight: 16,
    })

    this.load.spritesheet('ground', 'assets/tileset/ground.png', {
      frameWidth: 16,
      frameHeight: 16,
    })

    this.load.spritesheet('secondlayer', 'assets/tileset/secondlayer.png', {
      frameWidth: 16,
      frameHeight: 16,
    })

    this.load.spritesheet('shadow', 'assets/tileset/shadow.png', {
      frameWidth: 16,
      frameHeight: 16,
    })

    this.load.spritesheet('wall', 'assets/tileset/wall.png', {
      frameWidth: 16,
      frameHeight: 16,
    })

    this.load.spritesheet('adam', 'assets/character/adam.png', {
      frameWidth: 32,
      frameHeight: 48,
    })
    this.load.spritesheet('ash', 'assets/character/ash.png', {
      frameWidth: 32,
      frameHeight: 48,
    })
    this.load.spritesheet('lucy', 'assets/character/lucy.png', {
      frameWidth: 32,
      frameHeight: 48,
    })
    this.load.spritesheet('nancy', 'assets/character/nancy.png', {
      frameWidth: 32,
      frameHeight: 48,
    })

    // ***새롭게 16px 캐릭터로 변경하기 위한 코드***
    // this.load.spritesheet('logan', 'assets/character/logan.png', {
    //   frameWidth: 16,
    //   frameHeight: 32,
    // });
    // this.load.spritesheet('kevin', 'assets/character/kevin.png', {
    //   frameWidth: 16,
    //   frameHeight: 32,
    // });
    // this.load.spritesheet('zoey', 'assets/character/zoey.png', {
    //   frameWidth: 16,
    //   frameHeight: 32,
    // });
    // this.load.spritesheet('emma', 'assets/character/emma.png', {
    //   frameWidth: 16,
    //   frameHeight: 32,
    // });

    this.load.on('complete', () => {
      this.preloadComplete = true
      this.launchBackground(store.getState().user.backgroundMode)
    })
  }

  init() {
    this.network = new Network()
    // this.network2 = new Network2()
    this.gameNetwork = new GameNetwork()
  }

  private launchBackground(backgroundMode: BackgroundMode) {
    this.scene.launch('background', { backgroundMode })
  }

  launchGame() {
    if (!this.preloadComplete) return
    this.network.webRTC?.checkPreviousPermission()
    this.scene.launch('game', {
      network: this.network,
      // network2: this.network2,
    })

    // update Redux state
    store.dispatch(setRoomJoined(true))
  }

  changeBackgroundMode(backgroundMode: BackgroundMode) {
    this.scene.stop('background')
    this.launchBackground(backgroundMode)
  }
}
