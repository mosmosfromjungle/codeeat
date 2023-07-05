import React from 'react';
import styled from 'styled-components';
import Box from '@mui/material/Box'
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useState } from 'react'
import { ConversationList } from './DMList';
import { Content } from '../GlobalStyle';
import { DMHeader } from './DMHeader';
import DMBubbles from './DMContents';
import DMBottom from './DMBottom';

const Backdrop = styled.div`
  position: fixed;
  display: flex;
  gap: 10px;
  bottom: 25px;
  right: 17px;
  align-items: flex-end;
`
const DMwrapper = styled(Box)`
  height: 570px;
  width: 395px;
  background: #F6F6F6;
  border: 10px solid #FFFFF5;
  padding: 1px 1px;
  border-radius: 20px 20px 10px 10px;

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
    <Content>
        <DMwrapper>
        <DMHeader/>
          <DMBubbles newMessage={newMessage}/>
          <DMBottom setNewMessage={setNewMessage}/>
        </DMwrapper>
    </Content>
    </Backdrop>
  );
}