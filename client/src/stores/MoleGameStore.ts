import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { useAppSelector, useAppDispatch } from '../hooks'
import { DIALOG_STATUS, setDialogStatus } from './UserStore'

import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'


export const moleGameSlice = createSlice({
  name: 'molegame',
  initialState: {
    moleGameOpen: false,
    friendName: '',
    friendCharacter: '',
    friendPoint: '',
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
    },
    setMoleGameFriendInfo: (
      state,
      action: PayloadAction<{ name: string, character: string }>
    ) => {
      state.friendName = action.payload.name
      state.friendCharacter = action.payload.character
    },
    setMoleGameFriendData: (
      state,
      action: PayloadAction<{ point: string }>
    ) => {
      state.friendPoint = action.payload.point
    },
  },
})

export const { 
  openMoleGameDialog, 
  closeMoleGameDialog,
  setMoleGameFriendInfo,
  setMoleGameFriendData,
} =
moleGameSlice.actions

export default moleGameSlice.reducer
