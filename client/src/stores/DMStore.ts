import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message } from 'react-chat-ui';

export const DMSlice = createSlice({
  name: 'dm',
  initialState: {
    directMessages: Message,
    showDMList: false,
    showDMRoom: false,
    roomId: '',
    receiverId: '',
    receiverName: '',
    newMessage: {
      senderId: '',
      receiverId: '',
      id: 0,
      message: '',
      roomId: '',
    },
  },
  reducers: {
    setShowDMList: (state, action: PayloadAction<boolean>) => {
      state.showDMList = action.payload;
    },
    setShowDMRoom: (state, action: PayloadAction<boolean>) => {
      state.showDMRoom = action.payload;
    },
    setReceiverId: (state, action: PayloadAction<string>) => {
      state.receiverId = action.payload;
    },
    setReceiverName: (state, action: PayloadAction<string>) => {
      state.receiverName = action.payload;
    },
    setRoomId: (state, action: PayloadAction<string>) => {
      state.roomId = action.payload;
    },
    setNewMessage: (state, action: PayloadAction<any>) => {
      state.newMessage = action.payload;
    },
  },
});

export const {
  setReceiverId,
  setReceiverName,
  setRoomId,
  setNewMessage,
  setShowDMList,
  setShowDMRoom,
} = DMSlice.actions;

export default DMSlice.reducer;
