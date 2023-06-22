import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { sanitizeId } from '../util'
import { BackgroundMode } from '../../../types/BackgroundMode'

import phaserGame from '../PhaserGame'
import Bootstrap from '../scenes/Bootstrap'

export function getInitialBackgroundMode() {
  const currentHour = new Date().getHours()
  return currentHour > 6 && currentHour <= 18 ? BackgroundMode.DAY : BackgroundMode.NIGHT
}

export enum ENTRY_PROCESS {
  ENTRY = 'entry',
  JOIN = 'join',
  LOGIN = 'login',
  WELCOME = 'welcome',
}

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    backgroundMode: getInitialBackgroundMode(),
    showJoystick: window.innerWidth < 650,
    
    /* Initial value for user */
    sessionId: '',   // TODO: colyseus 서버에서 세션으로 관리되고 있다면 굳이 token을 안해도 되지 않을까?? 어차피 session이 끝나지 않으면 로그아웃이 되지 않을텐데..?
    accessToken: '',
    userId: '',
    username: '',
    character: '',
    userLevel: '',
    // userTier: '',
    playerNameMap: new Map<string, string>(),
    
    /* Status regarding user entry */
    entryProcess: ENTRY_PROCESS.ENTRY,
    entered: false,   // welcome 화면에서 확인을 눌러 게임 화면에서 캐릭터를 보게되는 시점
    showLogout: false,
    showVersion: false,

    /* Video and Audio connection */
    videoConnected: false,
    audioConnected: false,
    
    /* In-game dialogs */
    showProfile: false,
    showMoleGame: false, // UGLY: computer 등의 다른 사물들과의 connection status를 관리하는 다른 파일로 옮겨져야할 것으로 생각됨
  },
  reducers: {
    toggleBackgroundMode: (state) => {
      const newMode =
        state.backgroundMode === BackgroundMode.DAY ? BackgroundMode.NIGHT : BackgroundMode.DAY

      state.backgroundMode = newMode
      const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
      bootstrap.changeBackgroundMode(newMode)
    },
    setShowJoystick: (state, action: PayloadAction<boolean>) => {
      state.showJoystick = action.payload
    },
    
    setSessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload
    },
    setCharacter: (state, action: PayloadAction<string>) => {
      state.character = action.payload
    },
    setUserLevel: (state, action: PayloadAction<string>) => {
      state.userLevel = action.payload
    },
    setPlayerNameMap: (state, action: PayloadAction<{ id: string; name: string }>) => {
      state.playerNameMap.set(sanitizeId(action.payload.id), action.payload.name)
    },
    removePlayerNameMap: (state, action: PayloadAction<string>) => {
      state.playerNameMap.delete(sanitizeId(action.payload))
    },

    setEntryProcess: (state, action: PayloadAction<ENTRY_PROCESS>) => {
      state.entryProcess = action.payload
    },
    setEntered: (state, action: PayloadAction<boolean>) => {
      state.entered = action.payload
    },
    setShowLogout: (state, action: PayloadAction<boolean>) => {
      state.showLogout = action.payload
    },
    setShowVersion: (state, action: PayloadAction<boolean>) => {
      state.showVersion = action.payload
    },

    setVideoConnected: (state, action: PayloadAction<boolean>) => {
      state.videoConnected = action.payload
    },
    setAudioConnected: (state, action: PayloadAction<boolean>) => {
      state.audioConnected = action.payload
    },

    setShowProfile: (state, action: PayloadAction<boolean>) => {
      state.showProfile = action.payload
    },
    setShowMoleGame: (state, action: PayloadAction<boolean>) => {
      state.showMoleGame = action.payload
    },
  },
})

export const {
  toggleBackgroundMode,
  setShowJoystick,
  setSessionId,
  setAccessToken,
  setUserId,
  setUsername,
  setCharacter,
  setUserLevel,
  setPlayerNameMap,
  removePlayerNameMap,
  setEntryProcess,
  setEntered,
  setShowLogout,
  setShowVersion,
  setVideoConnected,
  setAudioConnected,
  setShowProfile,
  setShowMoleGame,
} = userSlice.actions

export default userSlice.reducer
