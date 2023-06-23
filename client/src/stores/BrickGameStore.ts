import { createSlice } from '@reduxjs/toolkit'

import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'


export const brickGameSlice = createSlice({
  name: 'brickgame',
  initialState: {
    brickGameOpen: false,
  },
  reducers: {
    openBrickGameDialog: (state) => {
      state.brickGameOpen = true
      const game = phaserGame.scene.keys.game as Game
      game.disableKeys()
    },
    closeBrickGameDialog: (state) => {
      const game = phaserGame.scene.keys.game as Game
      game.enableKeys()
      state.brickGameOpen = false
    }
  },
})

export const { openBrickGameDialog, closeBrickGameDialog } =
brickGameSlice.actions

export default brickGameSlice.reducer
