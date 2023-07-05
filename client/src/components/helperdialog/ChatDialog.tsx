import React, { useRef, useState, useEffect } from 'react'

import styled from 'styled-components'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import InputBase from '@mui/material/InputBase'
import CloseIcon from '@mui/icons-material/Close'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { Content, Header, HeaderTitle } from '../GlobalStyle'

import { MessageType, setFocused } from '../../stores/ChatStore'
import { setShowDMList, setShowDMRoom } from '../../stores/DMStore'
import { HELPER_STATUS, setHelperStatus } from '../../stores/UserStore'
import { useAppSelector, useAppDispatch } from '../../hooks'
import { getColorByString } from '../../util'

import phaserGame from '../../PhaserGame'
import Game from '../../scenes/Game'

const Backdrop = styled.div`
  position: fixed;
  display: flex;
  gap: 10px;
  bottom: 24px;
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
const Body = styled.div`
  flex: 1;
  height: calc(100% - 120px);
  overflow: auto;
  padding: 10px 32px 32px 32px;
  display: flex;
  flex-direction: column;
`
const MessageWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: px 2px;

  p {
    margin: 3px;
    text-shadow: 0.3px 0.3px gray;
    font-size: 20px;
    font-weight: bold;
    overflow-wrap: anywhere;
    font-family: Font_DungGeun;
    line-height: 1.2;
  }

  span {
    color: black;
    font-weight: normal;
  }

  .notification {
    color: grey;
    font-weight: normal;
  }
`
const InputWrapper = styled.form`
  height: 60px;
  padding: 4px 16px;
  display: flex;
  flex-direction: row;
  // background: linear-gradient(180deg, #000000c1, #242424c0);
  // border-radius: 0px 0px 3px 3px;
`
const InputTextField = styled(InputBase)`
  // border-radius: 0px 0px 10px 10px;
  input {
    padding: 5px;
    font-family: Font_DungGeun;
    font-size: 18px;
    color: black
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

const Message = ({ chatMessage, messageType }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false)

  return (
    <MessageWrapper
      onMouseEnter={() => {
        setTooltipOpen(true)
      }}
      onMouseLeave={() => {
        setTooltipOpen(false)
      }}
    >
      <Tooltip
        open={tooltipOpen}
        title={dateFormatter.format(chatMessage.createdAt)}
        placement="right"
        arrow
      >
        {messageType === MessageType.REGULAR_MESSAGE ? (
          <p
            style={{
              color: getColorByString(chatMessage.author),
            }}
          >
            {chatMessage.author}: <span>{chatMessage.content}</span>
          </p>
        ) : (
          <p className="notification">
            {chatMessage.author} {chatMessage.content}
          </p>
        )}
      </Tooltip>
    </MessageWrapper>
  )
}

export default function ChatDialog() {
  const [inputValue, setInputValue] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [readyToSubmit, setReadyToSubmit] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatMessages = useAppSelector((state) => state.chat.chatMessages)
  const focused = useAppSelector((state) => state.chat.focused)
  const helperStatus = useAppSelector((state) => state.user.helperStatus)

  const dispatch = useAppDispatch()
  const game = phaserGame.scene.keys.game as Game

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      // move focus back to the game
      inputRef.current?.blur()
      dispatch(setHelperStatus(HELPER_STATUS.NONE))
      dispatch(setShowDMList(false))
      dispatch(setShowDMRoom(false))
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    /*
      this is added because without this, 2 things happen at the same
      time when Enter is pressed, (1) the inputRef gets focus (from
      useEffect) and (2) the form gets submitted (right after the input
      gets focused)
    */
    if (!readyToSubmit) {
      setReadyToSubmit(true)
      return
    }

    /*
      move focus back to the game
    */
    inputRef.current?.blur()

    const val = inputValue.trim()
    setInputValue('')
    
    if (val) {
      // console.log(val)
      game.network.addChatMessage(val)
      game.myPlayer.updateDialogBubble(val)
    }

    inputRef.current?.focus()
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
  }, [chatMessages, helperStatus])

  return (
    <Backdrop>
      <ButtonGroup>
        <Wrapper>
          <Content>
            <Header>
              <HeaderTitle style={{ backgroundColor: 'yellow' }}>
                전체 메세지
              </HeaderTitle>
              <IconButton
                aria-label="close dialog"
                className="close"
                onClick={() => dispatch(setHelperStatus(HELPER_STATUS.NONE))}
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </Header>
            <Body>
              {chatMessages.map(({ messageType, chatMessage }, index) => (
                <Message chatMessage={chatMessage} messageType={messageType} key={index} />
              ))}
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
            </Body>
            <InputWrapper onSubmit={handleSubmit}>
              <InputTextField
                inputRef={inputRef}
                autoFocus={focused}
                fullWidth
                placeholder="친구들에게 메세지를 보내보세요 !"
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
                <InsertEmoticonIcon style={{ color: 'black'}} />
              </IconButton>
            </InputWrapper>
          </Content>
        </Wrapper>
      </ButtonGroup>
    </Backdrop>
  )
}
