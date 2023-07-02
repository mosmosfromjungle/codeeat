import { enableMapSet } from 'immer'
import { configureStore } from '@reduxjs/toolkit'
import userReducer from './UserStore'
import chatReducer from './ChatStore'
import roomReducer from './RoomStore'
import moleGameReducer from './MoleGameStore'
import brickGameReducer from './BrickGameStore'
import rainGameDialogReducer from './RainGameDialogStore'
import codingRunReducer from './CodingRunStore'
import rainGameReducer from './RainGameStore'
import dmReducer from './DMStore'
enableMapSet()

const rootReducer = {
  user: userReducer,
  chat: chatReducer,
  room: roomReducer,
  molegame: moleGameReducer,
  brickgame: brickGameReducer,
  rainGameDialog: rainGameDialogReducer,
  raingame: rainGameReducer,
  codingrun: codingRunReducer,
  dm: dmReducer,
}

const store = configureStore({
  reducer: rootReducer,
  // Temporary disable serialize check for redux as we store MediaStream in ComputerStore.
  // https://stackoverflow.com/a/63244831
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store
