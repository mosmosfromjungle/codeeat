/*
  Icon: mui 라이브러리 사용 (https://mui.com/material-ui/material-icons/)
*/
import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'

import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import CloseIcon from '@mui/icons-material/Close'

import { DIALOG_STATUS, setDialogStatus, setShowLogout } from '../stores/UserStore'
import { useAppSelector, useAppDispatch } from '../hooks'
import { ENTRY_PROCESS, setAccessToken, setEntryProcess } from '../stores/UserStore'

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
  height: 40px;
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
  font-size: 20px;
  font-weight: bold;
  top: 10px;
  left: 150px;
  font-family: Font_DungGeun;
`

const ChatBox = styled(Box)`
  height: 130px;
  width: 360px;
  overflow: auto;
  background: #2c2c2c;
  border: 1px solid #00000029;
  padding: 20px 20px;
  border-radius: 0px 0px 10px 10px;
  color: white;
  text-align: center;
`

const Question = styled.div`
  font-size: 18px;
  font-family: Font_DungGeun;
  margin-bottom: 20px;
`

const Buttons = styled.div`
  button {
    font-size: 18px;
    font-family: Font_DungGeun;
  }
`

export default function LogoutDialog() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatMessages = useAppSelector((state) => state.chat.chatMessages)
  const focused = useAppSelector((state) => state.chat.focused)
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
  }, [chatMessages, showLogout])

  const handleLogout = () => {
    ;
  }

  return (
    <Backdrop>
        <Wrapper>
          <Content>
            <ChatHeader>
              <Title>
                나가기
              </Title>
              <IconButton
                aria-label="close dialog"
                className="close"
                onClick={() => dispatch(setShowLogout(false)) }
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </ChatHeader>
              <ChatBox>
                <Question>
                  정말 로그아웃 하시겠습니까 ?
                </Question>
                <Buttons>
                  {/* <Button onClick={() => dispatch(setDialogStatus(DIALOG_STATUS.ENTRY)) }> */} 
                  <Button onClick={() => window.location.href = '/' }>
                    네
                  </Button>
                  <Button onClick={() => dispatch(setShowLogout(false)) }>
                    아니요
                  </Button>
                </Buttons>
              </ChatBox>
          </Content>
        </Wrapper>
    </Backdrop>
  )
}
