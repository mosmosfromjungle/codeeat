/*
  Icon: mui 라이브러리 사용 (https://mui.com/material-ui/material-icons/)
*/
import { useRef, useEffect } from 'react'
import styled from 'styled-components'

import Fab from '@mui/material/Fab'

import 'emoji-mart/css/emoji-mart.css'

import ChatIcon from '@mui/icons-material/Chat'
import DMIcon from '@mui/icons-material/Send'
import UserIcon from '@mui/icons-material/SupervisorAccount'
import LogoutIcon from '@mui/icons-material/ExitToApp';

import { setFocused, setShowChat, setShowDM, setShowUser } from '../stores/ChatStore'
import { setShowLogout } from '../stores/UserStore'
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`

const FabWrapper = styled.div`
  margin-top: auto;
`

export default function HelperButtonGroup() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatMessages = useAppSelector((state) => state.chat.chatMessages)
  const roomJoined = useAppSelector((state) => state.room.roomJoined)
  const focused = useAppSelector((state) => state.chat.focused)
  const showChat = useAppSelector((state) => state.chat.showChat)
  const showDM = useAppSelector((state) => state.chat.showDM)
  const showUser = useAppSelector((state) => state.chat.showUser)
  const showLogout = useAppSelector((state) => state.user.showLogout)

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
  }, [chatMessages, showChat, showDM, showUser, showLogout])

  return (
    <Backdrop>
      <ButtonGroup>
        <Wrapper>
          {roomJoined && (
            <FabWrapper>
              <Fab
                onClick={() => showChat ? (
                  dispatch(setShowChat(false)),
                  dispatch(setFocused(false))
                ) : (
                  dispatch(setShowChat(true)),
                  dispatch(setFocused(true))
                )}
              >
                <ChatIcon />
              </Fab>
            </FabWrapper>
          )}
        </Wrapper>

        <Wrapper>
          {roomJoined && (
            <FabWrapper>
              <Fab
                onClick={() => showDM ? (
                  dispatch(setShowDM(false)),
                  dispatch(setFocused(false))
                ) : (
                  dispatch(setShowDM(true)),
                  dispatch(setFocused(true))
                )}
              >
                <DMIcon />
              </Fab>
            </FabWrapper>
          )}
        </Wrapper>

        <Wrapper>
          {roomJoined && (
            <FabWrapper>
              <Fab
                onClick={() => showUser ? (
                  dispatch(setShowUser(false))
                ) : (
                  dispatch(setShowUser(true))
                )}
              >
                <UserIcon />
              </Fab>
            </FabWrapper>
          )}
        </Wrapper>

        {roomJoined && (
          <FabWrapper>
          <Fab
            onClick={() => showLogout ? (
              dispatch(setShowLogout(false))
            ) : (
              dispatch(setShowLogout(true))
            )}
          >
            <LogoutIcon />
          </Fab>
          </FabWrapper>
        )}
      </ButtonGroup>
    </Backdrop>
  )
}
