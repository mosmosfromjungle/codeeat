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

import { setShowProfile } from '../stores/UserStore'
import { useAppSelector, useAppDispatch } from '../hooks'
import { getMyProfile } from '../apicalls/auth';


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
  left: 80px;
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

export default function ProfileDialog() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatMessages = useAppSelector((state) => state.chat.chatMessages)
  const focused = useAppSelector((state) => state.chat.focused)
  const showProfile = useAppSelector((state) => state.user.showProfile)
  const username = useAppSelector((state) => state.user.username)
  const character = useAppSelector((state) => state.user.character)
  const userLevel = useAppSelector((state) => state.user.userLevel)
  const imgpath = `../../public/assets/character/single/${character}_idle_anim_19.png`

  const dispatch = useAppDispatch()

  const [git, setGit] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [message, setMessage] = useState<string>('')

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

  useEffect(() => {
    (async () => {
      getMyProfile()
        .then((response) => {
          if (!response) return;
          const { contactGit, contactEmail, profileMessage } = response
          setGit(contactGit)
          setEmail(contactEmail)
          setMessage(profileMessage)
        })
        .catch((error) => {
          console.error(error);
        });
    })();
  }, []);

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
                Profile
              </Title>
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
                      <Avatar src={imgpath} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <React.Fragment>
                          <Typography sx={{ display: 'inline'}} variant="caption" color="white">
                            Lv.{userLevel}
                          </Typography>
                          <Typography sx={{ display: 'inline', margin: '10px' }} variant="caption" color="yellow">
                            Gold
                          </Typography>
                        </React.Fragment>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography sx={{ display: 'inline' }} variant="subtitle2" color="white">
                            {username}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Typography color="white">{git}</Typography>
                  <Typography color="white">{email}</Typography>
                  <Typography color="white">{message}</Typography>
              </List>
            </ChatBox>
          </Content>
        </Wrapper>
    </Backdrop>
  )
}
