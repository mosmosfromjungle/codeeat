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
    newMessageCnt: 0,
    newMessage: {
      senderName: '',
      receiverName: '',
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
    setNewMessageCnt: (state, action: PayloadAction<number>) => {
      state.newMessageCnt += action.payload;
      if (state.newMessageCnt < 0) state.newMessageCnt = 0;
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
  setNewMessageCnt,
  setReceiverName,
  setRoomId,
  setNewMessage,
  setShowDMList,
  setShowDMRoom,
} = DMSlice.actions;

export default DMSlice.reducer;
