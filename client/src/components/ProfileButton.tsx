/*
  Icon: mui 라이브러리 사용 (https://mui.com/material-ui/material-icons/)
*/
import React, { useRef, useEffect } from 'react'
import styled from 'styled-components'

import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { setShowProfile } from '../stores/UserStore'
import { useAppSelector, useAppDispatch } from '../hooks'

const Backdrop = styled.div`
  position: fixed;
  display: flex;
  bottom: 16px;
  left: 16px;
  align-items: flex-end;
`

export default function ProfileButton() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatMessages = useAppSelector((state) => state.chat.chatMessages)
  const loggedIn = useAppSelector((state) => state.user.loggedIn)
  const roomJoined = useAppSelector((state) => state.room.roomJoined)
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

  return (
    <Backdrop>
      {roomJoined && loggedIn && (
        <Button
          onClick={() => showProfile ? (
            dispatch(setShowProfile(false))
          ) : (
            dispatch(setShowProfile(true))
          )}
        >
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
        </Button>
      )}
    </Backdrop>
  )
}
