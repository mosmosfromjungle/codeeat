import React, { useState, useRef } from 'react';
import TextField from '@mui/material/TextField';
import { setFocused } from '../../stores/ChatStore';
import { Message } from 'react-chat-ui';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import InputAdornment from '@mui/material/InputAdornment';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { io, Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents, IDMRoomStatus } from '../../apicalls/DM';
import styled from 'styled-components';

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

export default function BottomAppBar(props) {
  const dispatch = useAppDispatch();
  const { setNewMessage } = props;
  const focused = useAppSelector((state) => state.chat.focused);
  const roomStatus = useAppSelector((state) => state.dm.dmProcess);

  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (value === '') {
      setValue('');
      return;
    }

    const newMessage = new Message({
      id: 0,
      message: value,
    });
    setNewMessage(newMessage);
    setValue('');
  };

  const handleOnKeyDown = (e) => {
    if (e.keyCode == 13) {
      handleSubmit(e);
    }
  };

  return (
    <DMbottom>
        <TextField
          onFocus={() => {
            if (!focused) {
              dispatch(setFocused(true));
            }
          }}
          onBlur={() => {
            dispatch(setFocused(false));
          }}
          value={value}
          fullWidth
          margin="dense"
          id="outlined-multiline-static"
          label="메세지 보내기"
          multiline
          maxRows={2}
          onChange={(event) => {
            setValue(event.target.value);
          }}
          onKeyDown={handleOnKeyDown}
          InputProps={{
            style: { fontFamily: 'Ycomputer-Regular', color: 'black' },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton color="primary" sx={{ p: '10px' }} onClick={handleSubmit} edge="end">
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
    </DMbottom>
  );
}
const DMbottom = styled.div`
  background: blue;

  font-size: 28px;
  font-weight: bold;
  display: flex;
  height: 70px;
  flex-direction: row;
  alsign-items: center;
  justify-content: space-between;
`;

const ButtonWrapper = styled.button`
  background: none;
  border: none;
`;

const TitleImage = styled.img`
  margin-left: 3px;
  margin-right: 13px;
  width: 28px;
`;

const TitleText = styled.div`
  font-size: 23px;
`;
