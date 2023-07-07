import { useRef, useEffect } from 'react'
import styled from 'styled-components'

import ChatIcon from '@mui/icons-material/Chat'
import DMIcon from '@mui/icons-material/Send'
import UserIcon from '@mui/icons-material/SupervisorAccount'
import LogoutIcon from '@mui/icons-material/ExitToApp';
import HelpIcon from '@mui/icons-material/Help';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt'
import { PersonAddRounded, MailOutlineRounded, PeopleRounded, ChatBubbleRounded, EmailRounded } from '@mui/icons-material'
import BGMController from '../BGMController'

import { setFocused } from '../../stores/ChatStore'
import { setShowDMList, setShowDMRoom } from '../../stores/DMStore'
import { HELPER_STATUS, setHelperStatus } from '../../stores/UserStore'
import { useAppSelector, useAppDispatch } from '../../hooks'
import { HelperButton } from '../GlobalStyle'

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
  const helperStatus = useAppSelector((state) => state.user.helperStatus)
  const showDMList = useAppSelector((state) => state.dm.showDMList)
  const showDMRoom = useAppSelector((state) => state.dm.showDMRoom)

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
  }, [chatMessages, showDMList, helperStatus])

  return (
    <Backdrop>

      <ButtonGroup>

        {roomJoined && (
          <BGMController/>
        )}
        
        <Wrapper>
          {roomJoined && (
            <FabWrapper>
              <HelperButton
                disableRipple
                onClick={() => helperStatus === HELPER_STATUS.CHAT ? (
                  console.log('clicked the button'),
                  dispatch(setHelperStatus(HELPER_STATUS.NONE)),
                  dispatch(setFocused(false))
                ) : (
                  dispatch(setHelperStatus(HELPER_STATUS.CHAT)),
                  dispatch(setFocused(true)),
                  dispatch(setShowDMRoom(false)),
                  dispatch(setShowDMList(false))
                )}
              >
                {/* <ChatIcon /> */}
                <ChatBubbleRounded />
              </HelperButton>
            </FabWrapper>
          )}
        </Wrapper>

        <Wrapper>
          {roomJoined && (
            <FabWrapper>
              <HelperButton
                disableRipple
                onClick={() => showDMList || showDMRoom || helperStatus === HELPER_STATUS.DM ? (
                  dispatch(setShowDMRoom(false)),
                  dispatch(setShowDMList(false)),
                  dispatch(setHelperStatus(HELPER_STATUS.NONE)),
                  dispatch(setFocused(false))
                ) : (
                  dispatch(setHelperStatus(HELPER_STATUS.DM)),
                  dispatch(setShowDMList(true)),
                  dispatch(setFocused(true))
                )}
              >
                {/* <DMIcon /> */}
                <EmailRounded />
              </HelperButton>
            </FabWrapper>
          )}
        </Wrapper>

        <Wrapper>
          {roomJoined && (
            <FabWrapper>
              <HelperButton
                disableRipple
                onClick={() => helperStatus === HELPER_STATUS.USERS ? (
                  dispatch(setHelperStatus(HELPER_STATUS.NONE))
                ) : ( 
                  dispatch(setHelperStatus(HELPER_STATUS.USERS)),
                  dispatch(setShowDMRoom(false)),
                  dispatch(setShowDMList(false))
                )}
              >
                {/* <UserIcon /> */}
                <PeopleRounded />
              </HelperButton>
            </FabWrapper>
          )}
        </Wrapper>

        <Wrapper>
          {roomJoined && (
            <FabWrapper>
              <HelperButton
                disableRipple
                onClick={() => helperStatus === HELPER_STATUS.FRIENDS ? (
                  dispatch(setHelperStatus(HELPER_STATUS.NONE))
                ) : ( 
                  dispatch(setHelperStatus(HELPER_STATUS.FRIENDS)),
                  dispatch(setShowDMRoom(false)),
                  dispatch(setShowDMList(false))
                )}
              >
                {/* <SentimentSatisfiedAltIcon /> */}
                <PersonAddRounded />
              </HelperButton>
            </FabWrapper>
          )}
        </Wrapper>

        <Wrapper>
          {roomJoined && (
            <FabWrapper>
              <HelperButton
                disableRipple
                onClick={() => helperStatus === HELPER_STATUS.LOGOUT ? (
                  dispatch(setHelperStatus(HELPER_STATUS.NONE))
                ) : ( 
                  dispatch(setHelperStatus(HELPER_STATUS.LOGOUT)),
                  dispatch(setShowDMRoom(false)),
                  dispatch(setShowDMList(false))
                )}
              >
                <LogoutIcon />
              </HelperButton>
            </FabWrapper>
          )}
        </Wrapper>

        <Wrapper>
          {roomJoined && (
            <FabWrapper>
              <HelperButton
                disableRipple
                onClick={() => helperStatus === HELPER_STATUS.VERSION ? (
                  dispatch(setHelperStatus(HELPER_STATUS.NONE))
                ) : ( 
                  dispatch(setHelperStatus(HELPER_STATUS.VERSION)),
                  dispatch(setShowDMRoom(false)),
                  dispatch(setShowDMList(false))
                )}
              >
                <HelpIcon />
              </HelperButton>
            </FabWrapper>
          )}
        </Wrapper>
      </ButtonGroup>
    </Backdrop>
  )
}
