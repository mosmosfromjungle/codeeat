import React, { useState, useEffect } from 'react';
import { ChatFeed } from 'react-chat-ui';
import { useAppDispatch, useAppSelector } from '../../hooks';
import styled from 'styled-components';
import Game from '../../scenes/Game';
import phaserGame from '../../PhaserGame';
import { setNewMessageCnt } from '../../stores/DMStore';

const Wrapper = styled.div`
  height: 456px;
  width: 370px;
`;

export default function DMBubbles(props) {
  const dispatch = useAppDispatch();
  const game = phaserGame.scene.keys.game as Game;
  const socketNetwork = game.dmNetwork;
  const roomId = useAppSelector((state) => state.dm.roomId);
  const receiverName = useAppSelector((state) => state.dm.receiverName);
  const username = useAppSelector((state) => state.user.username);
  const newMessage = useAppSelector((state) => state.dm.newMessage);

  const [messageList, setMessageList] = useState<any>([]);
  const _joinRoom = (oldMessages) => {
      setMessageList(oldMessages);
    };

  useEffect(() => {
    socketNetwork.joinRoom(roomId, username, receiverName, _joinRoom);
  }, []);

  useEffect(() => {
    if (!props.newMessage || props.newMessage?.message.length === 0) return;

    const body = {
      roomId: roomId,
      senderName: username,
      receiverName: receiverName,
      message: props.newMessage.message,
    };

    setMessageList((messageList) => [...messageList, props.newMessage]);

    game.dmNetwork.sendMessage(body);
  }, [props.newMessage?.message]);

  useEffect(() => {
    setMessageList((messageList) => [...messageList, newMessage]);
    dispatch(setNewMessageCnt(-1))
  }, [newMessage]);

  return (
    <>
      <Wrapper>
        <ChatFeed
          maxHeight={446}
          messages={messageList || []}
          bubblesCentered={false}
          bubbleStyles={{
            text: {
              fontFamily: 'Font_DungGeun',
              fontSize: 20,
              color: 'black',
              fontWeight: 'bold'
            },
            chatbubble: {
              borderRadius: '8px',
              padding: '8px 16px',
              maxWidth: 200,
              width: 'fit-content',
              margin: '8px 4px 0 16px',
              borderRight: '3px solid #b2c1bb',
              borderBottom: '3px solid #b2c1bb',
              backgroundColor: 'white',
              wordBreak: 'break-all',
            },
            userBubble: {
              backgroundColor: '#b6d4c8',
            },
          }}
        />
      </Wrapper>
    </>
  );
}
