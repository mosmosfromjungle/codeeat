/*
  Icon: mui 라이브러리 사용 (https://mui.com/material-ui/material-icons/)
*/
import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'

import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'
import InputBase from '@mui/material/InputBase'

import CloseIcon from '@mui/icons-material/Close'

import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon'
import { setNewMessageCnt } from '../stores/DMboxStore'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

import { MessageType, setFocused, setShowChat, setShowDM, setShowUser } from '../stores/ChatStore'
import { setShowLogout } from '../stores/UserStore'
import { useAppSelector, useAppDispatch } from '../hooks'
import { getColorByString } from '../util'
import { Message, ChatFeed } from 'react-chat-ui'

export default function DMDialog() {
  const [inputValue, setInputValue] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [readyToSubmit, setReadyToSubmit] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatMessages = useAppSelector((state) => state.dm.newMessage)
  const focused = useAppSelector((state) => state.chat.focused)
  const showDM = useAppSelector((state) => state.chat.showDM)

  const dispatch = useAppDispatch()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      // move focus back to the game
      inputRef.current?.blur()
      dispatch(setShowChat(false))
      dispatch(setShowDM(false))
      dispatch(setShowUser(false))
      dispatch(setShowLogout(false))
    }
  }
const [value, setValue] = useState('')

const handleSubmit = (event) => {
  event.preventDefault()
   
  if (value === '') {
    setValue('')
    return;
  }
  const newMessage = new Message({
    id: 0,
    message: value
  })
    setNewMessage(newMessage)
    setValue('')
  }

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
  }, [chatMessages, showDM])

  return (
    <Backdrop>
      <ButtonGroup>
        <Wrapper>
          <Content>
            <ChatHeader>
              <Title>
                개인 메세지
              </Title>
              <IconButton
                aria-label="close dialog"
                className="close"
                onClick={() => dispatch(setShowDM(false))}
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </ChatHeader>
            <ChatBox>

              <div ref={messagesEndRef} />
              {showEmojiPicker && (
                <EmojiPickerWrapper>
                  <Picker 
                    data={data}
                    theme="dark"
                    showSkinTones={false}
                    showPreview={false}
                    onEmojiSelect={(emoji) => {
                      setInputValue(inputValue + emoji.native)
                      setShowEmojiPicker(!showEmojiPicker)
                      dispatch(setFocused(true))
                    }}
                    exclude={['recent', 'flags']}
                  />
                </EmojiPickerWrapper>
              )}
            </ChatBox>
            <InputWrapper onSubmit={handleSubmit}>
              <InputTextField
                inputRef={inputRef}
                autoFocus={focused}
                fullWidth
                placeholder="친구에게 메세지를 보내보세요 !"
                value={inputValue}
                onKeyDown={handleKeyDown}
                onChange={handleChange}
                onFocus={() => {
                  if (!focused) {
                    dispatch(setFocused(true))
                    setReadyToSubmit(true)
                  }
                }}
                onBlur={() => {
                  dispatch(setFocused(false))
                  setReadyToSubmit(false)
                }}
              />
              <IconButton aria-label="emoji" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                <InsertEmoticonIcon />
              </IconButton>
            </InputWrapper>
          </Content>
        </Wrapper>
      </ButtonGroup>
    </Backdrop>
  )
}

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
  height: 400px;
  width: 400px;
  overflow: auto;
  background: #2c2c2c;
  border: 1px solid #00000029;
  padding: 10px 10px;
`

const MessageWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: px 2px;

  p {
    margin: 3px;
    text-shadow: 0.3px 0.3px black;
    font-size: 20px;
    font-weight: bold;
    overflow-wrap: anywhere;
    font-family: Font_DungGeun;
  }

  span {
    color: white;
    font-weight: normal;
  }

  .notification {
    color: grey;
    font-weight: normal;
  }

  :hover {
    background: #3a3a3a;
  }
`

const InputWrapper = styled.form`
  box-shadow: 10px 10px 10px #00000018;
  border: 1px solid #42eacb;
  border-radius: 0px 0px 10px 10px;
  display: flex;
  flex-direction: row;
  background: linear-gradient(180deg, #000000c1, #242424c0);
`

const InputTextField = styled(InputBase)`
  border-radius: 0px 0px 10px 10px;
  input {
    padding: 5px;
    font-family: Font_DungGeun;
  }
`

const EmojiPickerWrapper = styled.div`
position: absolute;
bottom: 110px;
right: 0px;
`

const dateFormatter = new Intl.DateTimeFormat('en', {
  timeStyle: 'short',
  dateStyle: 'short',
})