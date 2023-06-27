import { useState } from 'react';
import TextField from '@mui/material/TextField';
import { setFocused } from '../../stores/ChatStore';
import { Message } from 'react-chat-ui';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import InputAdornment from '@mui/material/InputAdornment';
import { useAppDispatch, useAppSelector } from '../../hooks';
import styled from 'styled-components';

export default function DMBottom(props) {
  const dispatch = useAppDispatch();
  const { setNewMessage } = props;
  const focused = useAppSelector((state) => state.chat.focused);

  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const Rvalue = value.trim()
    if (Rvalue === '') {
      setValue('');
      return;
    }
      console.log('보냄');
    const newMessage = new Message({
      id: 0,
      message: Rvalue,
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
        InputProps={{style: {fontFamily: 'Font-Dungeun', color: 'black'},
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
  background: white;
  font-size: 28px;
  font-weight: bold;
  display: flex;
  height: 70px;
  flex-direction: row;
  alsign-items: center;
  justify-content: space-between;
  
`;