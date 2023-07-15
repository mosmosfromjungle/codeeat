import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'
import { Interface } from 'readline'

export interface RainGameUser {
  username: string
  character: string
}

export interface RainGameState {
  point: number
  heart: number
  item: string[]
}
export interface RainGameStates {
  host: string
  rainGameReady: boolean
  rainGameInProgress: boolean
  myState: RainGameState
  youState: RainGameState
  me: RainGameUser
  you: RainGameUser
  words: string
  winner: string
}

export const initialState: RainGameStates = {
  host: '',
  rainGameReady: false,
  rainGameInProgress: false,
  myState: {
    point: 0,
    heart: 3,
    item: [],
  },
  youState: {
    point: 0,
    heart: 3,
    item: [],
  },
  me: {
    username: '',
    character: '',
  },
  you: {
    username: '',
    character: '',
  },
  words: '',
  winner: ''
}

// Define Slice
export const rainGameSlice = createSlice({
  name: 'raingame',
  initialState,
  reducers: {
    setRainGameHost: (state, action: PayloadAction<string>) => {
      state.host = action.payload
    },

    setRainGameReady: (state, action: PayloadAction<boolean>) => {
      state.rainGameReady = action.payload
    },

    setRainGameInProgress: (state, action: PayloadAction<boolean>) => {
      state.rainGameInProgress = action.payload
    },

    setRainGameYou: (state, action: PayloadAction<RainGameUser>) => {
      const { username, character } = action.payload
      state.you.username = username
      state.you.character = character
    },

    setRainGameMe: (state, action: PayloadAction<RainGameUser>) => {
      const { username, character } = action.payload
      state.me.username = username
      state.me.character = character
    },

    setRainStateMe: (state, action: PayloadAction<RainGameState>) => {
      const { point, heart, item } = action.payload
      state.myState.point = point
      state.myState.heart = heart
      state.myState.item = item
    },

    setRainStateYou: (state, action: PayloadAction<RainGameState>) => {
      const { point, heart, item } = action.payload
      state.youState.point = point
      state.youState.heart = heart
      state.youState.item = item
    },
    setRainGameYouWord: (state, action: PayloadAction<string>) => {
      state.words = action.payload
    },

    setRainGameWinner: (state, action: PayloadAction<string>) => {
      state.winner = action.payload
    }
  },
})

export const {
  setRainGameHost,
  setRainGameReady,
  setRainGameInProgress,
  setRainGameYou,
  setRainGameMe,
  setRainGameYouWord,
  setRainStateMe,
  setRainStateYou,
  setRainGameWinner
} = rainGameSlice.actions

export default rainGameSlice.reducer
