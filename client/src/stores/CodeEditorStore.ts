import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'

interface CodeEditorState {
  codeEditorDialogOpen: boolean
  codeEditorId: null | string
}

const initialState: CodeEditorState = {
  codeEditorDialogOpen: false,
  codeEditorId: null,
}

export const codeEditorSlice = createSlice({
  name: 'codeeditor',
  initialState,
  reducers: {
    openCodeEditorDialog: (state, action: PayloadAction<string>) => {
      state.codeEditorDialogOpen = true
      state.codeEditorId = action.payload
      const game = phaserGame.scene.keys.game as Game
      game.disableKeys()
    },
    closeCodeEditorDialog: (state) => {
      const game = phaserGame.scene.keys.game as Game
      game.enableKeys()
      game.network.disconnectFromCodeEditor(state.codeEditorId!)
      state.codeEditorDialogOpen = false
      state.codeEditorId = null
    }
  },
})

export const { openCodeEditorDialog, closeCodeEditorDialog } =
codeEditorSlice.actions

export default codeEditorSlice.reducer
