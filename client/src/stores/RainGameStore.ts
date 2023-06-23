import { createSlice } from '@reduxjs/toolkit'

import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'


export const rainGameSlice = createSlice({
  name: 'raingame',
  initialState: {
    rainGameOpen: false,
  },
  reducers: {
    openRainGameDialog: (state) => {
      state.rainGameOpen = true
      const game = phaserGame.scene.keys.game as Game
      game.disableKeys()
    },
    closeRainGameDialog: (state) => {
      const game = phaserGame.scene.keys.game as Game
      game.enableKeys()
      state.rainGameOpen = false
    }
  },
})

export const { openRainGameDialog, closeRainGameDialog } =
rainGameSlice.actions

export default rainGameSlice.reducer
