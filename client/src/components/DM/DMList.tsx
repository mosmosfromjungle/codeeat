import { useEffect, useState } from 'react';
import styled from 'styled-components';
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { Content, Header, HeaderTitle } from '../GlobalStyle'
import {
  setNewMessage,
  setReceiverName,
  setRoomId,
  setNewMessageCnt,
  setShowDMList,
  setShowDMRoom
} from '../../stores/DMStore';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  fetchRoomList,
  RoomListResponse,
} from '../../apicalls/DM/DM';

export const ConversationList = () => {
  const [rooms, setRooms] = useState<RoomListResponse[]>([]);
  const dispatch = useAppDispatch();
  const username = useAppSelector((state) => state.user.username);
  const newMessage = useAppSelector((state) => state.dm.newMessage)
  const newMessageCnt = useAppSelector((state) => state.dm.newMessageCnt)

  useEffect(() => {
    fetchRoomList(username)
    .then((data) => {
        setRooms(data);
    });
  }, []);

  useEffect(() => {
  }, [rooms]);

const handleClick = (room) => {
  dispatch(setReceiverName(room.receiverName));
  dispatch(setRoomId(room.roomId));

  dispatch(setNewMessageCnt(-1 * room.unreadCount))
  dispatch(setNewMessage({ message: '' }))
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
            if (newMessage?.message && newMessage?.senderName === room.receiverName && room.unreadCount === 0) {
              room.unreadCount! += 1;
            }
            if (newMessageCnt === 0) {
              room.unreadCount = 0
            }
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
                    <br></br>
                </UserNamewithLastMessage>
                {room.unreadCount! > 0 ? <UnreadCnt>{room.unreadCount}</UnreadCnt> : null}
              </ListTag>
            );
          })
        ) : (
          <>
            <NoDMMessage> <strong> 📭 아직 대화방이 없어요! </strong><br></br> </NoDMMessage>
            <NoDMMessage> <strong style={{ fontSize: '16px' }}>다른 플레이어와 개인대화를 시작해보세요!</strong> </NoDMMessage>
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
  // justify-content: flex-start;
  justify-content: space-between;
  // cursor: pointer;
  padding: 16px;
  // margin-bottom: 0px;
  border-bottom: 2px solid black;
  min-height: 20px;
`;
const UserNamewithLastMessage = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  color: black;
  // justify-content: space-between;
  // padding: 0px 0px 0px 0px;
  // border-bottom: 0.7px solid gray;
  // cursor: pointer;
  // font-size: 10px;
  height: 32px;
  font-family: Font_DungGeun;
  flex-grow: 1;

  // &:last-child {
  //   border-bottom: none;
  // }`;
const UserName = styled.div`
  width: 60px;
  display: block;
  font-size: 20px;
  // margin: 0px 0px 10px -10px;
  font-weight: bold;
  color: green;
`;
const LastMessage = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 20px;
  // margin: 0px 0px 0px 0px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 220px;
  height: 20px;
  flex-shrink: 1;
`;
const Backdrop = styled.div`
  position: fixed;
  display: flex;
  gap: 10px;
  bottom: 24px;
  right: 16px;
  align-items: flex-end;
`
const DMList = styled.div`
flex: 1;
  height: calc(100% - 76px);
  overflow: auto;
  padding: 10px 20px 0 20px;
  display: flex;
  flex-direction: column;
  
  .listitem && {
    flex: 0 0 auto;
    display: flex;
    justify-content: space-between;
  }
`

const UnreadCnt = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 20px;
  height: 20px;
  border-radius: 100%;
  background-color: red;
  color: white;
  font-size: 12px;
`

const NoDMMessage = styled.div`
  color: black;
  margin: 10px;
  // width: 300px;
  font-size: 20px;
  font-family: Font_DungGeun;
`