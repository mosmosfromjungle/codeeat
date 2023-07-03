// import Peer from 'peerjs';
// import store from '../stores';
// import { setMyStream, addVideoStream, removeVideoStream } from '../stores/FaceChatStore';
// import phaserGame from '../PhaserGame';
// import Game from '../scenes/Game';

// export default class FaceChatManager {
//   private myPeer: Peer;
//   myStream?: MediaStream;

//   constructor(private userId: string) {
//     const sanitizedId = this.makeId(userId);
//     this.myPeer = new Peer(sanitizedId);

//     this.myPeer.on('error', (err) => {
//       console.error('FaceChat WebRTC', err);
//     });

//     this.myPeer.on('call', (call) => {
//       call.answer();

//       call.on('stream', (userVideoStream) => {
//         store.dispatch(addVideoStream({ id: call.peer, call, stream: userVideoStream }));
//       });
//     });
//   }

//   onOpen() {
//     if (this.myPeer.disconnected) {
//       this.myPeer.reconnect();
//     }
//   }

//   onClose() {
//     this.stopFaceChat(false);
//     this.myPeer.disconnect();
//   }

//   private makeId(id: string) {
//     return `${id.toString().replace(/[^0-9a-z]/gi, 'G')}`;
//   }

//   startFaceChat() {
//     const game = phaserGame.scene.keys.game as Game;
//     // game.network.connectToFaceChat(store.getState().facechat.faceChatId!);

//     navigator.mediaDevices
//       ?.getUserMedia({
//         video: true,
//         audio: true,
//       })
//       .then((stream) => {
//         const track = stream.getVideoTracks()[0];
//         if (track) {
//           track.onended = () => {
//             this.stopFaceChat();
//           };
//         }

//         this.myStream = stream;
//         store.dispatch(setMyStream(stream));

//         // Call all existing users.
//         const game = phaserGame.scene.keys.game as Game;
//         const faceChatItem = game.faceChatMap.get(store.getState().facechat.faceChatId!);
//         if (faceChatItem) {
//           for (const userId of faceChatItem.currentUsers) {
//             this.onUserJoined(userId);
//           }
//         }
//       });
//   }

//   stopFaceChat(shouldDispatch = true) {
//     this.myStream?.getTracks().forEach((track) => track.stop());
//     this.myStream = undefined;
//     if (shouldDispatch) {
//       store.dispatch(setMyStream(null));
//       // Manually let all other existing users know screen sharing is stopped
//       const game = phaserGame.scene.keys.game as Game;
//       game.network.onStopFaceChat(store.getState().facechat.faceChatId!);
//     }
//   }

//   onUserJoined(userId: string) {
//     if (!this.myStream || userId === this.userId) return;

//     const sanatizedId = this.makeId(userId);
//     this.myPeer.call(sanatizedId, this.myStream);
//   }

//   onUserLeft(userId: string) {
//     if (userId === this.userId) return;

//     const sanatizedId = this.makeId(userId);
//     store.dispatch(removeVideoStream(sanatizedId));
//   }
// }
