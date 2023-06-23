import axios from 'axios';
import { UserResponseDto } from './DM';
import phaserGame from '../../src/PhaserGame';
import Game from '../../src/scenes/Game';
// 친구 추가 요청
export const addFriendReq = async (body: AddFriendRequestDto) => {
  try {
    const response = await axios.post(`/DM/addFriend`, body);
    if (response) {
      const {status} = response.data;
      if (response.status === 200) {
        if (status === 200) {
          const game = phaserGame.scene.keys.game as Game;
          game.network2.requestFriendReq(body);
          return 1;
        } else if (status === 404) {
          return 2;
        } else if (status === 409) {
          return 3;
        }
      } else {
        console.log('서버에러');
      }
    }
  } catch (error) {
    console.error('friend.ts', error);
  }
};

export interface AddFriendRequestDto {
  myInfo: UserResponseDto;
  friendInfo: UserResponseDto;
  status: number;
  message: string;
}

// user state type
export interface UserData {
  id: number;
  user_id: string;
  name: string;
  status_msg: string;
  profile_img_url: string;
  friends_list: Array<UserResponseDto>;
  room_list: Array<RoomListResponse>;
}

// 서버에서 채팅방 리스트에 대한 정보를 받아올 때
export interface RoomListResponse {
  // room_id: number;
  identifier: string;
  FriendName: string;
  last_chat: string;
  not_read_chat: number;
  last_read_chat_id: number;
  updatedAt: Date;
}