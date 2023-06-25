import { createSlice } from '@reduxjs/toolkit'

import { useAppSelector, useAppDispatch } from '../hooks'
import { DIALOG_STATUS, setDialogStatus } from './UserStore'

import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'


export const faceChatSlice = createSlice({
  name: 'facechat',
  initialState: {
    faceChatOpen: false,
  },
  reducers: {
    openFaceChatDialog: (state) => {
      state.faceChatOpen = true
      const game = phaserGame.scene.keys.game as Game
      game.disableKeys()
    },
    closeFaceChatDialog: (state) => {
      state.faceChatOpen = false
      const game = phaserGame.scene.keys.game as Game
      game.enableKeys()
    }
  },
})

export const { openFaceChatDialog, closeFaceChatDialog } =
faceChatSlice.actions

export default faceChatSlice.reducer
