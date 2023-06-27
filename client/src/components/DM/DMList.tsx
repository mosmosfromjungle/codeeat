import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import {
  setReceiverId,
  setReceiverName,
  setRoomId,
  setShowDMList,
  setShowDMRoom
} from '../../stores/DMStore';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  fetchRoomList,
  RoomListResponse,
  UserResponseDto,
} from '../../apicalls/DM/DM';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
import DefaultAvatar from '../../images/logo.png'

/* DM목록을 불러온다.  */
export const ConversationList = () => {
  const [rooms, setRooms] = useState<RoomListResponse[]>([]);
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.user.userId);
  const userName = useAppSelector((state) => state.user.userName);
  useEffect(() => {
    fetchRoomList(userId)
    .then((data) => {
        setRooms(data);
    });
  }, []);

  useEffect(() => {
    console.log('rooms', rooms); // 🐱
  }, [rooms]);

const handleClick = async (room) => {
  console.log(room)
  dispatch(setReceiverId(room.receiverInfo.userId == userId ? room.senderInfo.userId : room.receiverInfo.userId));
  console.log('setReceiverId :', room.receiverInfo.userId == userId ? room.senderInfo.userId : room.receiverInfo.userId)
  dispatch(setReceiverName(room.receiverInfo.userName == userName ? room.senderInfo.userName : room.receiverInfo.userName));
  console.log('setReceiverName :', room.receiverInfo.userName == userName ? room.senderInfo.userName : room.receiverInfo.userName )
  dispatch(setRoomId(room.roomId));
  console.log('setRoomId:', room.roomId)
  dispatch(setShowDMRoom(true))
  
}

return (
    <Backdrop>
        <DMwrapper>
        <DMHeader>
              <Title> DM 목록 </Title>
              <IconButton
                aria-label="close dialog"
                className="close"
                onClick={() => dispatch(setShowDMList(false))}
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </DMHeader>
        <DMList>
        {rooms.length !== 0 ? (
          rooms.map((room) => {
            return (
              <ListTag
                key={room._id}
                onClick={() => {
                  handleClick(room);
                }}
              >
                <ProfileAvatarImage
                  src={DefaultAvatar}
                  alt={room.receiverInfo.userName}
                />
                <UserNamewithLastMessage>
                  <UserName>{room.receiverInfo.userName}</UserName>
                    <LastMessage>
                      {room.message}
                    </LastMessage>
                </UserNamewithLastMessage>
              </ListTag>
            );
          })
        ) : (
          <>
            <NoDMMessage> <strong>아직 대화방이 없어요</strong><br></br> </NoDMMessage>
            <NoDMMessage> <strong>다른 플레이어와 개인대화를 시작해보세요!</strong><br></br> </NoDMMessage>
          </>
        )}
        </DMList>
      </DMwrapper>
    </Backdrop>
  );
};

const ProfileAvatarImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 100%;
`;

const ListTag = styled.li`
  width: 335px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  padding: 5px;
  margin-bottom: 10px;
`;
const UserNamewithLastMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: white;
  justify-content: space-between;
  padding: 0px 0px 0px 25px;
  border-bottom: 1px solid gray;
  cursor: pointer;
  font-size: 10px;
  height: 60px;
  font-family: Font_DungGeun;
`;
const UserName = styled.div`
  display: block;
  font-size: 15px;
  margin: 0px 0px 10px 0px;
  font-weight: bold;
  color: #33FF99;
`;
const LastMessage = styled.div`
  display: block;
  font-size: 1.5em;
  margin: 0px 0px 10px 0px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 200px;
  height: 20px;
`;
const Backdrop = styled.div`
position: fixed;
display: flex;
gap: 10px;
bottom: 75px;
right: 16px;
align-items: flex-end;
`
const DMList = styled.div`
height: 500px;
width: 360px;
overflow: auto;
background: #2c2c2c;
border: 1px solid #00000029;
padding: 10px 10px;
border-radius: 0px 0px 10px 10px;

Button {
  font-size: 17px;
  font-family: Font_DungGeun;
}
`;

const NoDMMessage = styled.div`
  color: white;
  width: 300px;
  font-size: 20px;
  font-family: Font_DungGeun;
`
const DMHeader = styled.div`
  position: relative;
  height: 40px;
  background: #000000a7;
  border-radius: 10px 10px 0px 0px;

  .close {
    position: absolute;
    top: 0;
    right: 0;
  }
`
const Title = styled.div`
  position: absolute;
  color: white;
  font-size: 20px;
  font-weight: bold;
  top: 10px;
  left: 150px;
  font-family: Font_DungGeun;
`
const DMwrapper = styled.div`
  height: 100%;
  margin-top: auto;
`