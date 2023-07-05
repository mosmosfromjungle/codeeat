import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { sanitizeId } from '../util'
import { BackgroundMode } from '../../../types/BackgroundMode'

import phaserGame from '../PhaserGame'
import Bootstrap from '../scenes/Bootstrap'
import Game from '../scenes/Game'

export function getInitialBackgroundMode() {
  const currentHour = new Date().getHours()
  return currentHour > 6 && currentHour <= 18 ? BackgroundMode.DAY : BackgroundMode.NIGHT
}

export enum DIALOG_STATUS {
  ENTRY = 'entry',
  JOIN = 'join',
  LOGIN = 'login',
  WELCOME = 'welcome',
  IN_MAIN  = 'in_main',
  GAME_LOBBY = 'game_lobby',
  GAME_WELCOME = 'game_welcome',
  IN_GAME = 'in_game',
}

export enum HELPER_STATUS {
  NONE = 'none',
  PROFILE = 'profile',
  CHAT = 'chat',
  DM = 'dm',
  USERS = 'users',
  FRIENDS = 'friends',
  LOGOUT = 'logout',
  VERSION = 'version',
}

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    backgroundMode: getInitialBackgroundMode(),
    showJoystick: window.innerWidth < 650,
    
    /* Initial value for user */
    sessionId: '',   // TODO: colyseus 서버에서 세션으로 관리되고 있다면 굳이 token을 안해도 되지 않을까?? 어차피 session이 끝나지 않으면 로그아웃이 되지 않을텐데..?
    gameSessionId:'',
    accessToken: '',
    userId: '',
    username: '',
    character: '',
    userLevel: '',
    playerNameMap: new Map<string, string>(),
    
    /* Status regarding screen dialog */
    dialogStatus: DIALOG_STATUS.ENTRY,
    helperStatus: HELPER_STATUS.NONE,
    // showQuit: false, // game 퇴장 dialog...
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
    setGameSessionId: (state, action: PayloadAction<string>) => {
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
    setDialogStatus: (state, action: PayloadAction<DIALOG_STATUS>) => {
      state.dialogStatus = action.payload
    },
    setHelperStatus: (state, action: PayloadAction<HELPER_STATUS>) => {
      const game = phaserGame.scene.keys.game as Game
      game.enableKeys()
      state.helperStatus = action.payload
    },
  },
})

export const {
  toggleBackgroundMode,
  setShowJoystick,
  setSessionId,
  setGameSessionId,
  setAccessToken,
  setUserId,
  setUsername,
  setCharacter,
  setUserLevel,
  setPlayerNameMap,
  removePlayerNameMap,
  setDialogStatus,
  setHelperStatus,
} = userSlice.actions

export default userSlice.reducer
