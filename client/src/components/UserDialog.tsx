/*
  Icon: mui 라이브러리 사용 (https://mui.com/material-ui/material-icons/)
*/
import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'

import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import CloseIcon from '@mui/icons-material/Close'

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { setShowUser } from '../stores/ChatStore'
import { useAppSelector, useAppDispatch } from '../hooks'

const Backdrop = styled.div`
  position: fixed;
  display: flex;
  gap: 10px;
  bottom: 16px;
  right: 16px;
  align-items: flex-end;
`

const Wrapper = styled.div`
  height: 100%;
  margin-top: auto;
`

const Content = styled.div`
  margin: 70px auto;
`

const ChatHeader = styled.div`
  position: relative;
  height: 35px;
  background: #000000a7;
  border-radius: 10px 10px 0px 0px;

  .close {
    position: absolute;
    top: 0;
    right: 0;
  }
`

const Title = styled.div`
  position: absolute;
  color: white;
  font-size: 15px;
  top: 10px;
  left: 150px;
`

const ChatBox = styled(Box)`
  height: 580px;
  width: 360px;
  overflow: auto;
  background: #2c2c2c;
  border: 1px solid #00000029;
  padding: 10px 10px;
  border-radius: 0px 0px 10px 10px;
`

// Todo: change the parameter in body part
const getUser = async() => {
  const apiUrl: string = 'http://auth/user/list';
  await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
  }).then(res => {
    if (res.ok) {
      console.log("Get user list is success.");
    }
    // Todo: need to hanle return codes - 200, 400, 409 ...
  })
};

// Todo: change the parameter in body part
const getUserDetail = async(userId: string) => {
  const apiUrl: string = 'http://auth/user/detaul/' + userId;
  await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
  }).then(res => {
    if (res.ok) {
      console.log("Get user detail is success.");
    }
    // Todo: need to hanle return codes - 200, 400, 409 ...
  })
};

export default function UserDialog() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatMessages = useAppSelector((state) => state.chat.chatMessages)
  const focused = useAppSelector((state) => state.chat.focused)
  const showUser = useAppSelector((state) => state.chat.showUser)

  const dispatch = useAppDispatch()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (focused) {
      inputRef.current?.focus()
    }
  }, [focused])

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages, showUser])

  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Backdrop>
        <Wrapper>
          <Content>
            <ChatHeader>
              <Title>
                User
              </Title>
              <IconButton
                aria-label="close dialog"
                className="close"
                onClick={() => dispatch(setShowUser(false))}
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </ChatHeader>
            <ChatBox>
              <ButtonGroup variant="text" aria-label="text button group">
                <Button>Bronze</Button>
                <Button>Silver</Button>
                <Button>Gold</Button>
                <Button>Platinum</Button>
                <Button>Ruby</Button>
              </ButtonGroup>
              <List>
                <Button>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar src="/assets/character/single/Adam_idle_anim_19.png" />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <React.Fragment>
                          <Typography sx={{ display: 'inline'}} variant="caption" color="white">
                            Lv.213
                          </Typography>
                          <Typography sx={{ display: 'inline', margin: '10px' }} variant="caption" color="yellow">
                            Gold
                          </Typography>
                        </React.Fragment>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography sx={{ display: 'inline' }} variant="subtitle2" color="white">
                            Junsu Pooh
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                </Button>
              </List>
            </ChatBox>
          </Content>
        </Wrapper>
    </Backdrop>
  )
}
