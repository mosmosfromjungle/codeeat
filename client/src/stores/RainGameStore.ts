import { createSlice, PayloadAction} from '@reduxjs/toolkit'
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
}
export interface RainGameStates {
  host : string
  rainGameReady: boolean
  rainGameInProgress : boolean
  myState: RainGameState
  youState: RainGameState
  me: RainGameUser
  you: RainGameUser
}
export const initialState: RainGameStates = {
  host: '',
  rainGameReady: false,
  rainGameInProgress: false,
  myState: {
    point: 0,
    heart: 3,
  },
  youState: {
    point: 0,
    heart: 3,
  },
  me: {
    username: '',
    character: '',
  },
  you: {
    username: '',
    character: '',
  },
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
      console.log('setRainGameReady')
      state.rainGameReady = action.payload
    },
    setRainGameInProgress: (state, action: PayloadAction<boolean>) => {
        console.log('setRainGameInProgress')
        state.rainGameInProgress = action.payload
      },
    setRainGameYou: (state, action: PayloadAction<RainGameUser>) => {
      console.log('setRainGameYou')
      const { username, character } = action.payload
      state.you.username = username
      state.you.character = character
    },

    setRainGameMe: (state, action: PayloadAction<RainGameUser>) => {
      console.log('setRainGameMe')
      const { username, character } = action.payload
      state.me.username = username
      state.me.character = character
    },
    setRainGameMyState: (state, action: PayloadAction<RainGameState>) => {
        console.log('setRainGameMyState')
      const { point, heart } = action.payload
      ;(state.myState.point = point), (state.myState.heart = heart)
    },

    setRainGameYouState: (state, action: PayloadAction<RainGameState>) => {
        console.log('setRainGameYou')
      const { point, heart } = action.payload
      ;(state.youState.point = point), (state.youState.heart = heart)
    },
    // setRainGameMyWords: (state, action: PayloadAction<KeywordRain>) => {
    //     state.myWords = action.payload
    // },
    // setRainGameYouWords: (state, action: PayloadAction<KeywordRain>) => {
    //     state.youWords = action.payload
    // }
  },
})

export const {
  setRainGameHost,
  setRainGameReady,
  setRainGameInProgress,
  setRainGameYou,
  setRainGameMe,
  setRainGameMyState,
  setRainGameYouState,
  // setRainGameMyWords,
  // setRainGameYouWords
} = rainGameSlice.actions

export default rainGameSlice.reducer
