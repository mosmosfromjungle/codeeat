import React, { useState, useEffect } from 'react';
import { ChatFeed } from 'react-chat-ui';
import { useAppDispatch, useAppSelector } from '../../hooks';
import styled from 'styled-components';
import DMNetwork from '../../services/DMNetwork';
import Game from '../../scenes/Game';
import phaserGame from '../../PhaserGame';

const Wrapper = styled.div`
  height: 450px;
  width: 370px;
`;

export default function DMBubbles(props) {
  const dispatch = useAppDispatch();
  const game = phaserGame.scene.keys.game as Game;
  const socketNetwork = game.dmNetwork;
  const roomId = useAppSelector((state) => state.dm.roomId);
  const receiverName = useAppSelector((state) => state.dm.receiverName);
  const userName = useAppSelector((state) => state.user.userName);
  const newMessage = useAppSelector((state) => state.dm.newMessage);

  const [messageList, setMessageList] = useState<any>([]);
  const _joinRoom = (oldMessages) => {
      setMessageList(oldMessages);
    };
// 🐱
  useEffect(() => {
    console.log('채팅방 들어감, roomId:' , roomId)
    socketNetwork.joinRoom(roomId, userName, receiverName, _joinRoom);
  }, []);

  useEffect(() => {
    if (!props.newMessage || props.newMessage?.message.length === 0) return;

    const body = {
      roomId: roomId,
      userName: userName,
      receiverName: receiverName,
      message: props.newMessage.message,
    };

    // 내가 쓴 메세지 채팅 리스트에 추가
    setMessageList((messageList) => [...messageList, props.newMessage]);

    // 내가 쓴 메세지 서버에 전송
    game.dmNetwork.sendMessage(body);
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
              fontFamily: 'Font-Dungeun',
              fontSize: 20,
              color: 'white',
              fontWeight: 'bold'
            },
            chatbubble: {
              borderRadius: 8,
              padding: 10,
              maxWidth: 200,
              width: 'fit-content',
              marginTop: 2,
              marginRight: 15,
              marginBottom: 1,
              marginLeft: 15,
              wordBreak: 'break-all',
              backgroundColor: '#147814',
            },
            userBubble: {
              backgroundColor: '#3ED0C8',
            },
          }}
        />
      </Wrapper>
    </>
  );
}
