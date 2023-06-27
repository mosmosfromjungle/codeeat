import React from 'react';
import styled from 'styled-components';
import Box from '@mui/material/Box'
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useState } from 'react'
import { ConversationList } from './DMList';
import { DMHeader } from './DMHeader';
import DMBubbles from './DMContents';
import { setNewMessage } from '../../stores/DMStore';
import { ChatBubble } from 'react-chat-ui';
import DMBottom from './DMBottom';

const Backdrop = styled.div`
  position: fixed;
  display: flex;
  gap: 10px;
  bottom: 16px;
  right: 16px;
  align-items: flex-end;
`
const DMwrapper = styled(Box)`
  height: 580px;
  width: 360px;
  overflow: auto;
  background: #2c2c2c;
  border: 25px solid #00000029;
  padding: 10px 10px;
  border-radius: 0px 0px 10px 10px;

  Button {
    font-size: 17px;
    font-family: Font_DungGeun;
  }
`
/* DMboxButton, something pop-up when clicks it */
export function DMRoom() {
  const [newMessage, setNewMessage] = useState<any>(null);

  return (
    <Backdrop>
        <DMwrapper>
          <DMHeader/>
          <DMBubbles newMessage={newMessage}/>
          <DMBottom setNewMessage={setNewMessage}/>
        </DMwrapper>
    </Backdrop>
  );
}