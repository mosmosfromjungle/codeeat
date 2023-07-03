// import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { sanitizeId } from '../util'

// import phaserGame from '../PhaserGame'
// import Game from '../scenes/Game'

// import Peer from 'peerjs'
// import FaceChatManager from '../web/FaceChatManager'

// interface faceChatState {
//   faceChatOpen: boolean;
//   faceChatId: null | string;
//   myStream: null | MediaStream;
//   peerStreams: Map<
//     string,
//     {
//       stream: MediaStream;
//       call: Peer.MediaConnection;
//     }
//   >;
//   faceChatManager: null | FaceChatManager;
// }

// const initialState: faceChatState = {
//   faceChatOpen: false,
//   faceChatId: null,
//   myStream: null,
//   peerStreams: new Map(),
//   faceChatManager: null,
// };

// export const faceChatSlice = createSlice({
//   name: 'facechat',
//   initialState,
//   reducers: {
//     openFaceChatDialog: (state, action: PayloadAction<{ faceChatId: string; myUserId: string }>) => {
//       if (!state.faceChatManager) {
//         state.faceChatManager = new FaceChatManager(action.payload.myUserId);
//       }

//       const game = phaserGame.scene.keys.game as Game
//       game.disableKeys()
      
//       state.faceChatManager.onOpen()
//       state.faceChatOpen = true
//       state.faceChatId = action.payload.faceChatId;
//     },
//     closeFaceChatDialog: (state) => {
//       const game = phaserGame.scene.keys.game as Game
//       game.enableKeys()

//       // game.network.disconnectFromFaceChat(state.faceChatId!)
//       for (const { call } of state.peerStreams.values()) {
//         call.close()
//       }

//       state.faceChatManager?.onClose();
//       state.faceChatOpen = false
//       state.faceChatId = null;
//       state.myStream = null;
//       state.peerStreams.clear();
//     },
//     setMyStream: (state, action: PayloadAction<null | MediaStream>) => {
//       state.myStream = action.payload;
//     },
//     addVideoStream: (
//       state,
//       action: PayloadAction<{
//         id: string;
//         call: Peer.MediaConnection;
//         stream: MediaStream;
//       }>
//     ) => {
//       state.peerStreams.set(sanitizeId(action.payload.id), {
//         call: action.payload.call,
//         stream: action.payload.stream,
//       });
//     },
//     removeVideoStream: (state, action: PayloadAction<string>) => {
//       state.peerStreams.delete(sanitizeId(action.payload));
//     },
//   },
// })

// export const {
//   closeFaceChatDialog,
//   openFaceChatDialog,
//   setMyStream,
//   addVideoStream,
//   removeVideoStream,
// } = faceChatSlice.actions;

// export default faceChatSlice.reducer
