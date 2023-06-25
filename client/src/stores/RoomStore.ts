import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Room, RoomAvailable } from 'colyseus.js'
import { RoomType } from '../../../types/Rooms'

interface RoomInterface extends RoomAvailable {
  name?: string
}

export interface PlayersInterface {
  name: string
  texture: string
}

/**
 * Colyseus' real time room list always includes the public lobby so we have to remove it manually.
 */
const isCustomRoom = (room: RoomInterface) => {
  return room.name === RoomType.CUSTOM
}

const isBrickRoom = (room: RoomInterface) => {
  return room.name === RoomType.BRICK
}

const isMoleRoom = (room: RoomInterface) => {
  return room.name === RoomType.MOLE
}

const isRainRoom = (room: RoomInterface) => {
  return room.name === RoomType.RAIN
}

const isFaceChatRoom = (room: RoomInterface) => {
  return room.name === RoomType.FACECHAT
}

export const roomSlice = createSlice({
  name: 'room',
  initialState: {
    lobbyJoined: false,
    roomJoined: false,
    gameJoined: false,
    roomId: '',
    roomName: '',
    roomDescription: '',
    gameRoomId: '',
    gameRoomName: '',
    gameRoomDescription: '',
    gamePlayers: new Array<PlayersInterface>(),
    availableRooms: {
      generalRooms: new Array<RoomAvailable>(),
      brickRooms: new Array<RoomAvailable>(),
      moleRooms: new Array<RoomAvailable>(),
      rainRooms: new Array<RoomAvailable>(),
      faceChatRooms: new Array<RoomAvailable>(),
    }
  },
  reducers: {
    setLobbyJoined: (state, action: PayloadAction<boolean>) => {
      state.lobbyJoined = action.payload
    },
    setRoomJoined: (state, action: PayloadAction<boolean>) => {
      state.roomJoined = action.payload
    },
    setGameJoined: (state, action: PayloadAction<boolean>) => {
      state.gameJoined = action.payload
    },
    setJoinedRoomData: (
      state,
      action: PayloadAction<{ id: string; name: string; description: string }>
    ) => {
      state.roomId = action.payload.id
      state.roomName = action.payload.name
      state.roomDescription = action.payload.description
    },
    setJoinedGameRoomData: (
      state,
      action: PayloadAction<{ id: string; name: string; description: string }>
    ) => {
      state.gameRoomId = action.payload.id
      state.gameRoomName = action.payload.name
      state.gameRoomDescription = action.payload.description
    },
    setGamePlayers: (state, action: PayloadAction<PlayersInterface[]>) => {
      state.gamePlayers = action.payload
    },
    setAvailableRooms: (state, action: PayloadAction<RoomAvailable[]>) => {
      state.availableRooms.generalRooms = action.payload.filter((room) => isCustomRoom(room))
    },
    setAvailableBrickRooms: (state, action: PayloadAction<RoomAvailable[]>) => {
      state.availableRooms.brickRooms = action.payload.filter((room) => isBrickRoom(room))
    },
    setAvailableMoleRooms: (state, action: PayloadAction<RoomAvailable[]>) => {
      state.availableRooms.moleRooms = action.payload.filter((room) => isMoleRoom(room))
    },
    setAvailableRainRooms: (state, action: PayloadAction<RoomAvailable[]>) => {
      state.availableRooms.rainRooms = action.payload.filter((room) => isRainRoom(room))
    },
    setAvailableFaceChatRooms: (state, action: PayloadAction<RoomAvailable[]>) => {
      state.availableRooms.faceChatRooms = action.payload.filter((room) => isFaceChatRoom(room))
    },
    addAvailableRooms: (state, action: PayloadAction<{ roomId: string; room: RoomAvailable }>) => {
      // if (!isCustomRoom(action.payload.room)) return
      if (isCustomRoom(action.payload.room)) {
        const roomIndex = state.availableRooms.generalRooms.findIndex(
          (room) => room.roomId === action.payload.roomId
        )
        if (roomIndex !== -1) {
          state.availableRooms.generalRooms[roomIndex] = action.payload.room
        } else {
          state.availableRooms.generalRooms.push(action.payload.room)
        }
      } else if (isBrickRoom(action.payload.room)) {
        const roomIndex = state.availableRooms.brickRooms.findIndex(
          (room) => room.roomId === action.payload.roomId
        )
        if (roomIndex !== -1) {
          state.availableRooms.brickRooms[roomIndex] = action.payload.room
        } else {
          state.availableRooms.brickRooms.push(action.payload.room)
        }
      } else if (isMoleRoom(action.payload.room)) {
        const roomIndex = state.availableRooms.moleRooms.findIndex(
          (room) => room.roomId === action.payload.roomId
        )
        if (roomIndex !== -1) {
          state.availableRooms.moleRooms[roomIndex] = action.payload.room
        } else {
          state.availableRooms.moleRooms.push(action.payload.room)
        }
      } else if (isRainRoom(action.payload.room)) {
        const roomIndex = state.availableRooms.rainRooms.findIndex(
          (room) => room.roomId === action.payload.roomId
        )
        if (roomIndex !== -1) {
          state.availableRooms.rainRooms[roomIndex] = action.payload.room
        } else {
          state.availableRooms.rainRooms.push(action.payload.room)
        }
      } else if (isFaceChatRoom(action.payload.room)) {
        const roomIndex = state.availableRooms.faceChatRooms.findIndex(
          (room) => room.roomId === action.payload.roomId
        )
        if (roomIndex !== -1) {
          state.availableRooms.faceChatRooms[roomIndex] = action.payload.room
        } else {
          state.availableRooms.faceChatRooms.push(action.payload.room)
        }
      }
    },
    removeAvailableRooms: (state, action: PayloadAction<string>) => {
      state.availableRooms.generalRooms = state.availableRooms.generalRooms.filter((room) => room.roomId !== action.payload)
      state.availableRooms.brickRooms = state.availableRooms.brickRooms.filter((room) => room.roomId !== action.payload)
      state.availableRooms.moleRooms = state.availableRooms.moleRooms.filter((room) => room.roomId !== action.payload)
      state.availableRooms.rainRooms = state.availableRooms.rainRooms.filter((room) => room.roomId !== action.payload)
      state.availableRooms.faceChatRooms = state.availableRooms.faceChatRooms.filter((room) => room.roomId !== action.payload)
    },
  },
})

export const {
  setLobbyJoined,
  setRoomJoined,
  setGameJoined,
  setJoinedRoomData,
  setJoinedGameRoomData,
  setGamePlayers,
  setAvailableRooms,
  setAvailableBrickRooms,
  setAvailableMoleRooms,
  setAvailableRainRooms,
  setAvailableFaceChatRooms,
  addAvailableRooms,
  removeAvailableRooms,
} = roomSlice.actions

export default roomSlice.reducer
