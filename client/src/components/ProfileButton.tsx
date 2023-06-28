import React, { useRef, useEffect } from 'react'
import styled from 'styled-components'

import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { setShowLogout, setShowProfile, DIALOG_STATUS } from '../stores/UserStore'
import { setFocused, setShowChat, setShowUser } from '../stores/ChatStore'
import { setShowDMList, setShowDMRoom } from '../stores/DMStore';
import { useAppSelector, useAppDispatch } from '../hooks'

const Backdrop = styled.div`
  position: fixed;
  display: flex;
  bottom: 16px;
  left: 16px;
  align-items: flex-end;
  background-color: lightgray;
  border-radius: 30px 30px 30px 30px;
`

const Profile = styled.div`
  font-size: 15px;
  font-family: Font_DungGeun;
`

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

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
  const imgpath = `/assets/character/single/${capitalizeFirstLetter(character)}_idle_anim_19.png`

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
            dispatch(setShowProfile(true)),
            dispatch(setShowLogout(false)),
            dispatch(setShowChat(false)),
            // dispatch(setShowDMRoom(false)),
            dispatch(setShowDMList(false)),
            dispatch(setShowUser(false)),
            dispatch(setShowLogout(false))
          )}
        >
          <ListItem>
            <ListItemAvatar>
              <Avatar src={imgpath} />
            </ListItemAvatar>
            <Profile>
              레벨 {userLevel}<br/>
              <strong>{username}</strong>
            </Profile>
          </ListItem>
        </Button>
      )}
    </Backdrop>
  )
}
