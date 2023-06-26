import React, { useState, useEffect } from 'react';
import { ChatFeed, Message } from 'react-chat-ui';
import { useAppDispatch, useAppSelector } from '../../hooks';
import styled from 'styled-components';
import { io, Socket } from 'socket.io-client';
import DMNetwork from '../../services/Network2';
import Game from '../../scenes/Game';
import phaserGame from '../../PhaserGame';
// import {DMSlice} from 'src/stores/DMboxStore';
import { color } from '@mui/system';
import { setNewMessage } from '../../stores/DMStore';
const Wrapper = styled.div`
  height: 450px;
  width: 370px;
`;

export default function DMBubbles(props) {
  const dispatch = useAppDispatch();
  const game = phaserGame.scene.keys.game as Game;
  const socketNetwork = game.network2;
  // 채팅 시작 시 저장되어 있던 채팅 리스트 보여줌
  const roomId = useAppSelector((state) => state.dm.roomId);
  const receiverId = useAppSelector((state) => state.dm.receiverId);
  const senderId = useAppSelector((state) => state.user.userId);
  const newMessage = useAppSelector((state) => state.dm.newMessage);

  const [messageList, setMessageList] = useState<any>([]);

  const callbackForJoinRoom = (oldMessages) => {
    setMessageList(oldMessages);
  };
  useEffect(() => {
    console.log('마운트');
    socketNetwork.joinRoom(roomId, senderId, receiverId, callbackForJoinRoom);
  }, []);

  useEffect(() => {
    if (!props.newMessage || props.newMessage?.message.length === 0) return;

    const body = {
      // id : 0,
      roomId: roomId,
      senderId: senderId,
      receiverId: receiverId,
      message: props.newMessage.message,
    };

    // 내가 쓴 메세지 채팅 리스트에 추가
    setMessageList((messageList) => [...messageList, props.newMessage]);

    // 내가 쓴 메세지 서버에 전송
    game.network2.sendMessage(body);
  }, [props.newMessage?.message]);

  useEffect(() => {
    setMessageList((messageList) => [...messageList, newMessage]);
  }, [newMessage]);

  return (
    <>
      <Wrapper>
        <ChatFeed
          maxHeight={450}
          messages={messageList || []} 
          bubblesCentered={false}
          bubbleStyles={{
            text: {
              fontFamily: 'Ycomputer-Regular',
              fontSize: 16,
              color: 'black',
            },
            chatbubble: {
              borderRadius: 8,
              padding: 10,
              maxWidth: 200,
              width: 'fit-content',
              marginTop: 2,
              marginRight: 7,
              marginBottom: 1,
              marginLeft: 7,
              wordBreak: 'break-all',
              backgroundColor: 'white',
            },
            userBubble: {
              backgroundColor: 'blue',
            },
          }}
        />
      </Wrapper>
    </>
  );
}
