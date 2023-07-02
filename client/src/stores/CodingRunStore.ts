import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { useAppSelector, useAppDispatch } from '../hooks'
import { DIALOG_STATUS, setDialogStatus } from './UserStore'

import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'


export const codingRunSlice = createSlice({
  name: 'codingrun',
  initialState: {
    codingRunOpen: false,
  },
  reducers: {
    openCodingRunDialog: (state) => {
      state.codingRunOpen = true
      const game = phaserGame.scene.keys.game as Game
      game.disableKeys()
    },
    closeCodingRunDialog: (state) => {
      state.codingRunOpen = false
      const game = phaserGame.scene.keys.game as Game
      game.enableKeys()
    },
  },
})

export const { 
  openCodingRunDialog, 
  closeCodingRunDialog,
} =
codingRunSlice.actions

export default codingRunSlice.reducer
