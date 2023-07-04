import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { Content, Header, HeaderTitle } from '../GlobalStyle'
import {
  setNewMessage,
  setReceiverName,
  setRoomId,
  setShowDMList,
  setShowDMRoom
} from '../../stores/DMStore';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  fetchRoomList,
  RoomListResponse,
} from '../../apicalls/DM/DM';

/* DM목록을 불러온다.  */
export const ConversationList = () => {
  const [rooms, setRooms] = useState<RoomListResponse[]>([]);
  const dispatch = useAppDispatch();
  const username = useAppSelector((state) => state.user.username);
  useEffect(() => {
    fetchRoomList(username)
    .then((data) => {
        setRooms(data);
    });
  }, []);

  useEffect(() => {
    console.log('방 목록 불러옴', rooms);
  }, [rooms]);

const handleClick = (room) => {
  dispatch(setReceiverName(room.receiverName));
  dispatch(setRoomId(room.roomId));
  console.log('룸아이디설정',room.roomId)
  dispatch(setShowDMRoom(true))
}
return (
    <Backdrop>
        <Content>
        <Header>
              <HeaderTitle> DM 목록 </HeaderTitle>
              <IconButton
                aria-label="close dialog"
                className="close"
                onClick={() => dispatch(setShowDMList(false))}
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </Header>
        <DMList>
        {rooms.length !== 0 ? (
          rooms.map((room) => {
            return (
              <ListTag
                key={room._id}
                onClick={() => {
                  dispatch(setShowDMList(false))
                  handleClick(room);
                }}>
                <UserNamewithLastMessage>
                  <UserName>{room.receiverName}</UserName>
                    <LastMessage>
                      {room.message}
                    </LastMessage>
                </UserNamewithLastMessage>
              </ListTag>
            );
          })
        ) : (
          <>
            <NoDMMessage> <strong> 📭 아직 대화방이 없어요</strong><br></br><br></br><br></br> </NoDMMessage>
            <NoDMMessage> <strong>다른 플레이어와 개인대화를 시작해보세요!</strong><br></br> </NoDMMessage>
          </>
        )}
        </DMList>
      </Content>
    </Backdrop>
  );
};

const ListTag = styled.li`
width: 100%;
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;
cursor: pointer;
padding: 16px;
margin-bottom: 10px;
border-bottom: 2px solid black;
`;
const UserNamewithLastMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: black;
  justify-content: space-between;
  padding: 0px 0px 0px 25px;
  border-bottom: 1px solid gray;
  cursor: pointer;
  font-size: 10px;
  height: 60px;
  font-family: Font_DungGeun;

  &:last-child {
    border-bottom: none;
  }`;
const UserName = styled.div`
  display: block;
  font-size: 25px;
  margin: 0px 0px 10px -10px;
  font-weight: bold;
  color: green;
`;
const LastMessage = styled.div`
  display: block;
  font-size: 20px;
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
bottom: 16px;
right: 16px;
align-items: flex-end;
`
const DMList = styled.div`
flex: 1;
  height: calc(100% - 76px);
  overflow: auto;
  padding: 10px 0 0 20px;
  display: flex;
  flex-direction: column;
  
  .listitem && {
    flex: 0 0 auto;
    display: flex;
    justify-content: space-between;
  }
`;

const NoDMMessage = styled.div`
  color: black;
  width: 300px;
  font-size: 20px;
  font-family: Font_DungGeun;
`