import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'

interface AcidRainState {
  acidrainDialogOpen: boolean
  acidrainId: null | string
  acidrainUrl: null | string
  urls: Map<string, string>
}

const initialState: AcidRainState = {
  acidrainDialogOpen: false,
  acidrainId: null,
  acidrainUrl: null,
  urls: new Map(),
}

export const acidrainSlice = createSlice({
  name: 'whiteboard',
  initialState,
  reducers: {
    openAcidRainDialog: (state, action: PayloadAction<string>) => {
      state.acidrainDialogOpen = true
      state.acidrainId = action.payload
      const url = state.urls.get(action.payload)
      if (url) state.acidrainUrl = url
      const game = phaserGame.scene.keys.game as Game
      game.disableKeys()
    },
    closeAcidRainDialog: (state) => {
      const game = phaserGame.scene.keys.game as Game
      game.enableKeys()
      game.network.disconnectFromAcidRain(state.acidrainId!)
      state.acidrainDialogOpen = false
      state.acidrainId = null
      state.acidrainUrl = null
    },
    setAcidRainUrls: (state, action: PayloadAction<{ acidrainId: string; roomId: string }>) => {
      state.urls.set(
        action.payload.acidrainId,
        `https://wbo.ophir.dev/boards/sky-office-${action.payload.roomId}`
      )
    },
  },
})

export const { openAcidRainDialog, closeAcidRainDialog, setAcidRainUrls } =
  acidrainSlice.actions

export default acidrainSlice.reducer
