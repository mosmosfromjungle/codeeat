import Phaser from 'phaser'
import Network from '../services/Network'
import Network2 from '../services/Network2'
import { BackgroundMode } from '../../../types/BackgroundMode'
import store from '../stores'
import { setRoomJoined } from '../stores/RoomStore'
import { BackgroundMode } from '../../../types/BackgroundMode'
import Network from '../services/Network'
import GameNetwork from '../services/GameNetwork'

export default class Bootstrap extends Phaser.Scene {
  private preloadComplete = false
  network!: Network

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
    this.load.tilemapTiledJSON('tilemap', 'assets/map/codeEatMap.json')
    // this.load.spritesheet('tiles_wall', 'assets/map/FloorAndGround.png', {
    //   frameWidth: 32,
    //   frameHeight: 32,
    // })

    // codeEatMap //////
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

    this.load.spritesheet('codeEatInteriors', 'assets/tileset/codeEatInteriors.png', {
      frameWidth: 16,
      frameHeight: 16,
    })

    this.load.spritesheet('School', 'assets/tileset/School.png', {
      frameWidth: 16,
      frameHeight: 16,
    })
    this.load.spritesheet('Generic', 'assets/tileset/Generic.png', {
      frameWidth: 16,
      frameHeight: 16,
    })
    this.load.spritesheet('camping', 'assets/tileset/camping.png', {
      frameWidth: 16,
      frameHeight: 16,
    })
    this.load.spritesheet('floorTiles', 'assets/tileset/floorTiles.png', {
      frameWidth: 16,
      frameHeight: 16,
    })
    this.load.spritesheet('Interiors', 'assets/tileset/Interiors.png', {
      frameWidth: 16,
      frameHeight: 16,
    })
    this.load.spritesheet('interior', 'assets/tileset/interior.png', {
      frameWidth: 16,
      frameHeight: 16,
    })
    this.load.spritesheet('ModernExteriorsFinal', 'assets/tileset/ModernExteriorsFinal.png', {
      frameWidth: 16,
      frameHeight: 16,
    })
    this.load.spritesheet('ModernExteriorsComplete', 'assets/tileset/ModernExteriorsComplete.png', {
      frameWidth: 16,
      frameHeight: 16,
    })
    this.load.spritesheet('Tilesets', 'assets/tileset/Tilesets.png', {
      frameWidth: 16,
      frameHeight: 16,
    })
    this.load.spritesheet('tree', 'assets/tileset/tree.png', {
      frameWidth: 16,
      frameHeight: 16,
    })


    // 기존 스카이오피스 코드
    // this.load.spritesheet('chairs', 'assets/items/chair.png', {
    //   frameWidth: 32,
    //   frameHeight: 64,
    // })
    // this.load.spritesheet('computers', 'assets/items/computer.png', {
    //   frameWidth: 96,
    //   frameHeight: 64,
    // })
    // this.load.spritesheet('raingames', 'assets/items/whiteboard.png', {
    //   frameWidth: 64,
    //   frameHeight: 64,
    // })
    // this.load.spritesheet('vendingmachines', 'assets/items/vendingmachine.png', {
    //   frameWidth: 48,
    //   frameHeight: 72,
    // })
    // this.load.spritesheet('molegames', 'assets/items/gamemachine.png', {
    //   frameWidth: 30,
    //   frameHeight: 50,
    // })
    // this.load.spritesheet('office', 'assets/tileset/Modern_Office_Black_Shadow.png', {
    //   frameWidth: 32,
    //   frameHeight: 32,
    // })
    // this.load.spritesheet('basement', 'assets/tileset/Basement.png', {
    //   frameWidth: 32,
    //   frameHeight: 32,
    // })
    // this.load.spritesheet('generic', 'assets/tileset/Generic.png', {
    //   frameWidth: 32,
    //   frameHeight: 32,
    // })
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
    this.network2 = new Network2()
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
      network2: this.network2,
    })

    // update Redux state
    store.dispatch(setRoomJoined(true))
  }

  changeBackgroundMode(backgroundMode: BackgroundMode) {
    this.scene.stop('background')
    this.launchBackground(backgroundMode)
  }
}
