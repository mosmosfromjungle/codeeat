import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'

interface CodeEditorState {
  codeEditorDialogOpen: boolean
  codeEditorId: null | string
  codeEditorUrl: null | string
  urls: Map<string, string>
}

const initialState: CodeEditorState = {
  codeEditorDialogOpen: false,
  codeEditorId: null,
  codeEditorUrl: null,
  urls: new Map(),
}

export const codeEditorSlice = createSlice({
  name: 'codeeditor',
  initialState,
  reducers: {
    openCodeEditorDialog: (state, action: PayloadAction<string>) => {
      state.codeEditorDialogOpen = true
      state.codeEditorId = action.payload
      const url = state.urls.get(action.payload)
      if (url) state.codeEditorUrl = url
      const game = phaserGame.scene.keys.game as Game
      game.disableKeys()
    },
    closeCodeEditorDialog: (state) => {
      const game = phaserGame.scene.keys.game as Game
      game.enableKeys()
      game.network.disconnectFromCodeEditor(state.codeEditorId!)
      state.codeEditorDialogOpen = false
      state.codeEditorId = null
      state.codeEditorUrl = null
    },
    setCodeEditorUrls: (state, action: PayloadAction<{ codeEditorId: string; roomId: string }>) => {
      state.urls.set(
        action.payload.codeEditorId,
        // `https://wbo.ophir.dev/boards/sky-office-${action.payload.roomId}`
        `https://www.google.com/webhp?igu=1`
      )
    },
  },
})

export const { openCodeEditorDialog, closeCodeEditorDialog, setCodeEditorUrls } =
  codeEditorSlice.actions

export default codeEditorSlice.reducer
