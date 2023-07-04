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
  words: string
  dheart: boolean
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
  words: '',
  dheart: false
}

// Define Slice
export const rainGameSlice = createSlice({
  name: 'raingame',
  initialState,
  reducers: {
    setRainGameHost: (state, action: PayloadAction<string>) => {
      state.host = action.payload;
      console.log("방장 설정:",state.host)
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
      const { point, heart } = action.payload;
      state.myState.point = point;
      state.myState.heart = heart;
      console.log("내 상태 설정:",JSON.parse(JSON.stringify(state.myState)))
    },

    setRainStateYou: (state, action: PayloadAction<RainGameState>) => {
      const { point, heart } = action.payload;
      state.youState.point = point;
      state.youState.heart = heart;
      console.log("상대 상태 설정:",JSON.parse(JSON.stringify(state.youState)))
    },

    setRainGameYouHeart: (state, action: PayloadAction<boolean>) => {
      state.heart = action.payload;
    },

    setRainGameYouWord: (state, action: PayloadAction<string>) => {
      state.words = action.payload
      console.log("상대 삭제 단어:", JSON.parse(JSON.stringify(state.words)))
    },
  },
})

export const {
  setRainGameHost,
  setRainGameReady,
  setRainGameInProgress,
  setRainGameYou,
  setRainGameMe,
  setRainGameYouHeart,
  setRainGameYouWord,
  setRainStateMe,
  setRainStateYou
} = rainGameSlice.actions

export default rainGameSlice.reducer
