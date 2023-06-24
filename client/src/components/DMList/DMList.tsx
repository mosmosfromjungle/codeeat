import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  setFriendId,
  setFriendName,
  setRoomId,
  setNewMessageCnt,
  setDmProcess,
  setNewMessage,
  setShowDMList,
} from '../../stores/DMboxStore';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  fetchRoomList,
  RoomListResponse,
  IDMRoomStatus,
  UserResponseDto,
} from '../../apicalls/DM';
import FriendRequest from '../FriendRequest/FriendRequest';
import DefaultAvatar from '../../../src/images/logo.png';
import Cookies from 'universal-cookie';
import { LeftToast } from '../ToastNotification';
import { setShowDM } from '../../stores/ChatStore';
const cookies = new Cookies();


/* 채팅목록을 불러온다. 클릭시, 채팅상대(state.dm.friendId)에 친구의 userId를 넣어준다  */
export const DMList = () => {
  const [rooms, setRooms] = useState<RoomListResponse[]>([]);
  const [friendRequestModal, setFriendRequestModal] = useState(false);
  const [FriendRequestProps, setFriendRequestProps] = useState<UserResponseDto>(
    {} as UserResponseDto
  );
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.user.userId) || cookies.get('userId');
  const newMessage = useAppSelector((state) => state.dm.newMessage);
  const newMessageCnt = useAppSelector((state) => state.dm.newMessageCnt);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  
  useEffect(() => {
    fetchRoomList(userId).then((data) => {
      data && setRooms(data);
    });
  }, []);

  const handleClick = async (room: RoomListResponse) => {
    if (room.status == IDMRoomStatus.FRIEND_REQUEST && room.unreadCount == 0) {
      setShowAlert(true);
      setFriendRequestProps(room.friendInfo);
    } else if (room.status == IDMRoomStatus.FRIEND_REQUEST && room.unreadCount == 1) {
      // 친구 요청 받음
      setFriendRequestModal(true);
      setFriendRequestProps(room.friendInfo);

    } else {
      try {
        dispatch(setShowDM);
        // Response userId
        room.friendInfo.userId && dispatch(setFriendId(room.friendInfo.userId));
        room.friendInfo.username && dispatch(setFriendName(room.friendInfo.username));
        dispatch(setRoomId(room.roomId));

        // room의 unreadCount, room.status 설정해준다
        dispatch(setNewMessageCnt(-1 * room.unreadCount));
        dispatch(setNewMessage({ message: '' }));
        dispatch(setDmProcess(room.status));
      } catch (error) {
        console.error('error', error);
      }
    }
  };

  return (
    <DMmessageList>
      {showAlert && <LeftToast text={'친구의 수락을 기다리고 있어요!'} />}
      <UnorderedList>
        {rooms.length !== 0 ? (
          rooms.map((room) => {
            if (
              newMessage?.message &&
              newMessage?.userId === room.friendInfo?.userId &&
              room.unreadCount === 0
            ) {
              room.unreadCount! += 1;
            }
            if (room.status !== IDMRoomStatus.FRIEND_REQUEST && newMessageCnt === 0) {
              room.unreadCount = 0;
            }

            return (
              <ListTag
                key={room._id}
                onClick={async () => {
                  await setShowAlert(false);
                  handleClick(room);
                }}
              >
                <ProfileAvatarImage
                  src={room.friendInfo.profileimage || DefaultAvatar}
                  alt={room.friendInfo.username}
                  width="60"
                />
                <IDwithLastMessage>
                  <UserID>{room.friendInfo.username}</UserID>
                  <LastMessageWithBadge>
                    <LastMessage>
                      {newMessage?.message && newMessage?.userId === room.friendInfo?.userId
                        ? newMessage?.message
                        : room.status == IDMRoomStatus.FRIEND_REQUEST && room.unreadCount === 0
                        ? (room.message = '친구요청 수락 대기중')
                        : room.message}
                    </LastMessage>
                    {room.unreadCount! > 0 ? <UnreadCnt>{room.unreadCount}</UnreadCnt> : null}
                  </LastMessageWithBadge>
                </IDwithLastMessage>
              </ListTag>
            );
          })
        ) : (
          <>
            <Textbox> 채팅방에 아무도 없어요 🥲 </Textbox>
            <Textbox> 친구 신청을 보내보아요 </Textbox>
          </>
        )}
      </UnorderedList>
      {friendRequestModal ? (
        <FriendRequest
          setRooms={setRooms}
          setFriendRequestModal={setFriendRequestModal}
          friendInfo={FriendRequestProps}
        />
      ) : null}
    </DMmessageList>
  );
};

const ProfileAvatarImage = styled.img`
  width: 75px;
  height: 75px;
  border-radius: 100%;
`;

const UnorderedList = styled.ul`
  padding: 0px 5px 5px 5px;
`;

const ListTag = styled.li`
  width: 320px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  padding: 5px;
`;
const IDwithLastMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0px 0px 0px 30px;
  border-bottom: none;
  cursor: pointer;
`;
const UserID = styled.div`
  display: block;
  font-size: 1.17em;
  margin: 0px 0px 10px 0px;
  font-weight: bold;
  // color: blue;
`;

const LastMessageWithBadge = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1em;
  margin: 0px 0px 10px 0px;
  width: 200px;
  height: 20px;
`;
const LastMessage = styled.div`
  display: block;
  font-size: 1em;
  margin: 0px 0px 10px 0px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 200px;
  height: 20px;
`;
const UnreadCnt = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 18px;
  height: 18px;
  border-radius: 100%;
  background-color: red;
  color: white;
  font-size: 12px;
`;

const DMmessageList = styled.div`
  background: #ffffff;
  height: 520px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Textbox = styled.div`
  font-size: 20px;
  text-align: center;
  margin: 5px;
`;
