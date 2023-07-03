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
    friendPoint: '0',
    host: '',
    problem: '',
    friendLife: '3',
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
      state.friendPoint = (parseInt(action.payload.point) + 1).toString();
    },
    setMoleGameProblem: (
      state,
      action: PayloadAction<{ problem: string }>
    ) => {
      state.problem = (parseInt(action.payload.problem) + 1).toString();
    },
    setMoleGameHost: (
      state,
      action: PayloadAction<{ host: string }>
    ) => {
      state.host = action.payload.host;
    },
    setMoleGameLife: (
      state,
      action: PayloadAction<{ life: string }>
    ) => {
      state.friendLife = (parseInt(action.payload.life) - 1).toString();
    },
    clearMoleGameFriendInfo: (
      state
    ) => {
      state.friendPoint = '0';
      state.friendLife = '3';
    },
  },
})

export const { 
  openMoleGameDialog, 
  closeMoleGameDialog,
  setMoleGameFriendInfo,
  setMoleGameFriendData,
  setMoleGameProblem,
  setMoleGameHost,
  setMoleGameLife,
  clearMoleGameFriendInfo,
} =
moleGameSlice.actions

export default moleGameSlice.reducer
