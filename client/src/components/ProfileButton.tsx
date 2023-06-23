import React, { useRef, useEffect } from 'react'
import styled from 'styled-components'

import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { setShowProfile, DIALOG_STATUS } from '../stores/UserStore'
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
  const dialogStatus = useAppSelector((state) => state.user.dialogStatus)
  const roomJoined = useAppSelector((state) => state.room.roomJoined)
  const focused = useAppSelector((state) => state.chat.focused)
  const showProfile = useAppSelector((state) => state.user.showProfile)
  const username = useAppSelector((state) => state.user.username)
  const character = useAppSelector((state) => state.user.character)
  const userLevel = useAppSelector((state) => state.user.userLevel)
  const imgpath = `../../public/assets/character/single/${character}_idle_anim_19.png`

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
      {roomJoined && dialogStatus === DIALOG_STATUS.IN_MAIN && (
        <Button
          onClick={() => showProfile ? (
            dispatch(setShowProfile(false))
          ) : (
            dispatch(setShowProfile(true))
          )}
        >
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
        </Button>
      )}
    </Backdrop>
  )
}
