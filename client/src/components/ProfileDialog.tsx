/*
  Icon: mui 라이브러리 사용 (https://mui.com/material-ui/material-icons/)
*/
import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'

import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'

import CloseIcon from '@mui/icons-material/Close'

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import 'emoji-mart/css/emoji-mart.css'

import { setShowProfile } from '../stores/UserStore'
import { useAppSelector, useAppDispatch } from '../hooks'

const Backdrop = styled.div`
  position: fixed;
  display: flex;
  gap: 10px;
  bottom: 40px;
  left: 16px;
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

  h3 {
    color: #fff;
    margin: 7px;
    font-size: 17px;
    text-align: center;
  }

  .close {
    position: absolute;
    top: 0;
    right: 0;
  }
`

const ChatBox = styled(Box)`
  height: 300px;
  width: 250px;
  overflow: auto;
  background: #2c2c2c;
  border: 1px solid #00000029;
  padding: 10px 10px;
  border-radius: 0px 0px 10px 10px;
`

// Todo: change the parameter in body part
const getProfile = async(userId: string) => {
  // I think the api need the 'userId' field
  const apiUrl: string = 'http://auth/myprofile';
  await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer {...}'
      },
  }).then(res => {
    if (res.ok) {
      console.log("Get my profile is success.");
    }
    // Todo: need to hanle return codes - 200, 400, 409 ...
  })
};

// Todo: change the parameter in body part
const updateProfile = async(userId: string) => {
  // I think the api need the 'userId' field
  const apiUrl: string = 'http://auth/update';
  await fetch(apiUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer {...}'
      },
      body: JSON.stringify({
        username: "newUserName",
        character: 2,
        contactGit: "differentGit.git",
        contactEmail: "",
        profileMessage: "안녕하십니까. 프로필 메세지를 작성해보았습니다."
      }),
  }).then(res => {
    if (res.ok) {
      console.log("Update my profile is success.");
    }
    // Todo: need to hanle return codes - 200, 400, 409 ...
  })
};

export default function ProfileDialog() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatMessages = useAppSelector((state) => state.chat.chatMessages)
  const focused = useAppSelector((state) => state.chat.focused)
  const showProfile = useAppSelector((state) => state.user.showProfile)

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
  }, [chatMessages, showProfile])

  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Backdrop>
        <Wrapper>
          <Content>
            <ChatHeader>
              <h3>Profile</h3>
              <IconButton
                aria-label="close dialog"
                className="close"
                onClick={() => dispatch(setShowProfile(false))}
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </ChatHeader>
            <ChatBox>
              <List>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar src="../../public/assets/character/single/Adam_idle_anim_19.png" />
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
              </List>
            </ChatBox>
          </Content>
        </Wrapper>
    </Backdrop>
  )
}
