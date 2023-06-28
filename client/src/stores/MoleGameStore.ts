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
    host: '',
    problem: '',
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
      action: PayloadAction<{ name: string, character: string, host: string }>
    ) => {
      state.friendName = action.payload.name
      state.friendCharacter = action.payload.character
      state.host = action.payload.host
    },
    setMoleGameFriendData: (
      state,
      action: PayloadAction<{ point: string }>
    ) => {
      state.friendPoint = action.payload.point
    },
    setMoleGameProblem: (
      state,
      action: PayloadAction<{ problem: string }>
    ) => {
      state.problem = (parseInt(action.payload.problem) + 1).toString();
    },
  },
})

export const { 
  openMoleGameDialog, 
  closeMoleGameDialog,
  setMoleGameFriendInfo,
  setMoleGameFriendData,
  setMoleGameProblem,
} =
moleGameSlice.actions

export default moleGameSlice.reducer
