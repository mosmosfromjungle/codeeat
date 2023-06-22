import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'

interface ComputerState {
  computerDialogOpen: boolean
  computerId: null | string
  computerUrl: null | string
  urls: Map<string, string>
}

const initialState: ComputerState = {
  computerDialogOpen: false,
  computerId: null,
  computerUrl: null,
  urls: new Map(),
}

export const computerSlice = createSlice({
  name: 'computer',
  initialState,
  reducers: {
    openComputerDialog: (state, action: PayloadAction<string>) => {
      state.computerDialogOpen = true
      state.computerId = action.payload
      const url = state.urls.get(action.payload)
      if (url) state.computerUrl = url
      const game = phaserGame.scene.keys.game as Game
      game.disableKeys()
    },
    closeComputerDialog: (state) => {
      const game = phaserGame.scene.keys.game as Game
      game.enableKeys()
      game.network.disconnectFromComputer(state.computerId!)
      state.computerDialogOpen = false
      state.computerId = null
      state.computerUrl = null
    },
    setComputerUrls: (state, action: PayloadAction<{ computerId: string; roomId: string }>) => {
      state.urls.set(
        action.payload.computerId,
        `https://wbo.ophir.dev/boards/sky-office-${action.payload.roomId}`
      )
    },
  },
})

export const { openComputerDialog, closeComputerDialog, setComputerUrls } =
  computerSlice.actions

export default computerSlice.reducer
