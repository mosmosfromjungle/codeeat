import React, { useRef, useEffect, Component, useState } from 'react'
import styled from 'styled-components'

import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'

import { setShowProfile, DIALOG_STATUS } from '../stores/UserStore'
import { setFocused } from '../stores/ChatStore'
import { setShowDMList, setShowDMRoom } from '../stores/DMStore'
import { useAppSelector, useAppDispatch } from '../hooks'
import ExperienceBar from '../components/ExperienceBar'
import { getMyProfile } from '../apicalls/auth'

const Backdrop = styled.div`
  // position: fixed;
  // display: flex;
  // bottom: 16px;
  // left: 16px;
  // align-items: flex-end;
  // background-color: lightgray;
  // border-radius: 25px;
  position: fixed;
  bottom: 16px;
  left: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`
const ContentWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 180px;
  height: 76px;
  z-index: 2;
`
const Profile = styled.div`
  font-family: Font_DungGeun;
  width: 100px;
  display: flex;
  flex-direction: column;
`
const CustomButton = styled(Button)`
  && {
    font-size: 24px;
    color: black;
    padding: 4px;
    width: 180px;
    height: 75px;
    &:hover {
      background-color: transparent; // 호버 스타일 제거
      box-shadow: none; // 호버 스타일 제거
    }
    background: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 -0.5 37 15" shape-rendering="crispEdges"
      %3E%3Cmetadata%3EMade with Pixels to Svg https://codepen.io/shshaw/pen/XbxvNj%3C/metadata%3E%3Cpath 
      stroke="%23222034" d="M2 0h33M1 1h1M35 1h1M0 2h1M36 2h1M0 3h1M36 3h1M0 4h1M36 4h1M0 5h1M36 5h1M0 6h1M36 6h1M0 7h1M36 7h1M0 8h1M36 8h1M0 9h1M36 9h1M0 10h1M36 10h1M0 11h1M36 11h1M0 12h1M36 12h1M1 13h1M35 13h1M2 14h33" /%3E%3Cpath 
      stroke="%23e2f0ea" d="M2 1h33M1 2h35M1 3h35M1 4h35M1 5h35M1 6h35M1 7h35M1 8h35M1 9h35M1 10h35M1 11h35M1 12h35M2 13h33" /%3E%3C/svg%3E');
  }
`
// stroke="%23ffffff"
// stroke="%23e2f0ea"

const ProfileButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
`

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
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
  // const userLevel = useAppSelector((state) => state.user.userLevel)
  const imgpath = `/assets/character/single/${capitalizeFirstLetter(character)}_idle_anim_19.png`
  const [userLevel, setUserLevel] = useState<string>()
  const [currentExp, setCurrentExp] = useState<number>()
  const [requiredExp, setRequiredExp] = useState<number>()

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

  useEffect(() => {
    ;(async () => {
      getMyProfile()
        .then((response) => {
          if (!response) return
          const { userLevel, currentExp, requiredExp } = response
          setUserLevel(userLevel)
          setCurrentExp(currentExp)
          setRequiredExp(requiredExp)
        })
        .catch((error) => {
          console.error(error)
        })
    })()
  }, [])

  return (
    <Backdrop>
      {roomJoined && dialogStatus === DIALOG_STATUS.IN_MAIN && (
        <ContentWrapper>
          <CustomButton
            disableRipple
            onClick={() => showProfile ? (
              dispatch(setShowProfile(false))
            ) : (
              dispatch(setShowProfile(true))
            )}
          >
            <ProfileButtonWrapper>
              <ListItem style={{padding: '8px 10px'}}>
                <ListItemAvatar>
                  <Avatar src={imgpath} />
                </ListItemAvatar>
                <Profile>
                  <span style={{ fontSize: '14px', lineHeight: '1' }}>Lv. {userLevel}<br/></span>
                  <span style={{ fontSize: '24px', lineHeight: '1' }}>{username}</span>
                </Profile>
              </ListItem>
              <ExperienceBar currentExperience={currentExp} experienceToNextLevel={requiredExp} />
            </ProfileButtonWrapper>
          </CustomButton>
        </ContentWrapper>
      )}
    </Backdrop>
  )
}
