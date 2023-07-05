import { useState } from 'react';
import TextField from '@mui/material/TextField';
import { setFocused } from '../../stores/ChatStore';
import { Message } from 'react-chat-ui';
import IconButton from '@mui/material/IconButton';
import { Send } from 'react-iconly'
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
      // console.log('보냄');
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
        variant='standard'
        margin="dense"
        id="outlined-multiline-static"
        maxRows={1}
        onChange={(event) => {
          setValue(event.target.value);
        }}
        onKeyDown={handleOnKeyDown}
        InputProps={{style: {fontFamily: 'Font-Dungeun', color: 'black'},
          endAdornment: (
            <InputAdornment position="end">
              <IconButton sx={{ p: '15px' }} onClick={handleSubmit} edge="end">
              <Send set="bulk" primaryColor="#00b0a7"/>
              </IconButton>
            </InputAdornment>
          ),
          disableUnderline:true,
        }}
        />
    </DMbottom>
  );
}
const DMbottom = styled.div`
  background: white;
  font-size: 35px;
  font-weight: bold;
  display: flex;
  height: 50px;
  flex-direction: row;
  alsign-items: center;
  justify-content: space-between;
  border: 2px solid #3ED0C8;
`;