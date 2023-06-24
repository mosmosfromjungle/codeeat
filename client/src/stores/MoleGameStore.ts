import { createSlice } from '@reduxjs/toolkit'

import { useAppSelector, useAppDispatch } from '../hooks'
import { DIALOG_STATUS, setDialogStatus } from './UserStore'

import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'


export const moleGameSlice = createSlice({
  name: 'molegame',
  initialState: {
    moleGameOpen: false,
  },
  reducers: {
    openMoleGameDialog: (state) => {
      state.moleGameOpen = true
      const game = phaserGame.scene.keys.game as Game
      game.disableKeys()
    },
    closeMoleGameDialog: (state) => {
      state.moleGameOpen = false
      const game = phaserGame.scene.keys.game as Game
      game.enableKeys()
    }
  },
})

export const { openMoleGameDialog, closeMoleGameDialog } =
moleGameSlice.actions

export default moleGameSlice.reducer
