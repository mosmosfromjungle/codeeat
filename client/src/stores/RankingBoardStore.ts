import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { useAppSelector, useAppDispatch } from '../hooks'
import { DIALOG_STATUS, setDialogStatus } from './UserStore'

import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'


export const rankingBoardSlice = createSlice({
  name: 'rankingboard',
  initialState: {
    rankingBoardOpen: false,
  },
  reducers: {
    openRankingBoardDialog: (state) => {
      state.rankingBoardOpen = true
      const game = phaserGame.scene.keys.game as Game
      game.disableKeys()
    },
    closeRankingBoardDialog: (state) => {
      state.rankingBoardOpen = false
      const game = phaserGame.scene.keys.game as Game
      game.enableKeys()
    },
  },
})

export const { 
  openRankingBoardDialog, 
  closeRankingBoardDialog,
} =
rankingBoardSlice.actions

export default rankingBoardSlice.reducer
