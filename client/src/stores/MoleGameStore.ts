import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'

interface MoleGameState {
  moleGameDialogOpen: boolean
  moleGameId: null | string
}

const initialState: MoleGameState = {
  moleGameDialogOpen: false,
  moleGameId: null,
}

export const moleGameSlice = createSlice({
  name: 'molegame',
  initialState,
  reducers: {
    openMoleGameDialog: (state, action: PayloadAction<string>) => {
      state.moleGameDialogOpen = true
      state.moleGameId = action.payload
      const game = phaserGame.scene.keys.game as Game
      game.disableKeys()
    },
    closeMoleGameDialog: (state) => {
      const game = phaserGame.scene.keys.game as Game
      game.enableKeys()
      game.network.disconnectFromMoleGame(state.moleGameId!)
      state.moleGameDialogOpen = false
      state.moleGameId = null
    }
  },
})

export const { openMoleGameDialog, closeMoleGameDialog } =
moleGameSlice.actions

export default moleGameSlice.reducer
