import { useRef, useEffect } from 'react'
import styled from 'styled-components'

import Fab from '@mui/material/Fab'
import ChatIcon from '@mui/icons-material/Chat'
import DMIcon from '@mui/icons-material/Send'
import UserIcon from '@mui/icons-material/SupervisorAccount'
import LogoutIcon from '@mui/icons-material/ExitToApp';
import HelpIcon from '@mui/icons-material/Help';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt'

import { setFocused } from '../../stores/ChatStore'
import { setShowDMList, setShowDMRoom } from '../../stores/DMStore'
import { HELPER_STATUS, setHelperStatus } from '../../stores/UserStore'
import { useAppSelector, useAppDispatch } from '../../hooks'

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
const CustomFab = styled(Fab)`
  position: relative;
  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: -2px;
    width: 60px;
    height: 60px;
    shape-rendering: crispEdges;
    z-index: -1;
    background: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 -0.5 14 13" shape-rendering="crispEdges"
      %3E%3Cmetadata%3EMade with Pixels to Svg https://codepen.io/shshaw/pen/XbxvNj%3C/metadata%3E%3Cpath 
      stroke="%23222034" d="M3 0h8M2 1h1M11 1h1M1 2h1M12 2h1M0 3h1M13 3h1M0 4h1M13 4h1M0 5h1M13 5h1M0 6h1M13 6h1M0 7h1M13 7h1M0 8h1M13 8h1M0 9h1M13 9h1M1 10h1M12 10h1M2 11h1M11 11h1M3 12h8" /%3E%3Cpath 
      stroke="%23e2f0ea" d="M3 1h8M2 2h10M1 3h12M1 4h12M1 5h12M1 6h12M1 7h12M1 8h12M1 9h12M2 10h10M3 11h8" /%3E%3C/svg%3E');
  }
`
// stroke="%23ffffff"
// stroke="%23e2f0ea"

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
        <Wrapper>
          {roomJoined && (
            <FabWrapper>
              <CustomFab
                onClick={() => helperStatus === HELPER_STATUS.CHAT ? (
                  dispatch(setHelperStatus(HELPER_STATUS.NONE)),
                  dispatch(setFocused(false))
                ) : (
                  dispatch(setHelperStatus(HELPER_STATUS.CHAT)),
                  dispatch(setFocused(true)),
                  dispatch(setShowDMRoom(false)),
                  dispatch(setShowDMList(false))
                )}
              >
                <ChatIcon />
              </CustomFab>
            </FabWrapper>
          )}
        </Wrapper>

        <Wrapper>
          {roomJoined && (
            <FabWrapper>
              <CustomFab
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
                <DMIcon />
              </CustomFab>
            </FabWrapper>
          )}
        </Wrapper>

        <Wrapper>
          {roomJoined && (
            <FabWrapper>
              <CustomFab
                onClick={() => helperStatus === HELPER_STATUS.USERS ? (
                  dispatch(setHelperStatus(HELPER_STATUS.NONE))
                ) : ( 
                  dispatch(setHelperStatus(HELPER_STATUS.USERS)),
                  dispatch(setShowDMRoom(false)),
                  dispatch(setShowDMList(false))
                )}
              >
                <UserIcon />
              </CustomFab>
            </FabWrapper>
          )}
        </Wrapper>

        <Wrapper>
          {roomJoined && (
            <FabWrapper>
              <CustomFab
                onClick={() => helperStatus === HELPER_STATUS.FRIENDS ? (
                  dispatch(setHelperStatus(HELPER_STATUS.NONE))
                ) : ( 
                  dispatch(setHelperStatus(HELPER_STATUS.FRIENDS)),
                  dispatch(setShowDMRoom(false)),
                  dispatch(setShowDMList(false))
                )}
              >
                <SentimentSatisfiedAltIcon />
              </CustomFab>
            </FabWrapper>
          )}
        </Wrapper>

        <Wrapper>
          {roomJoined && (
            <FabWrapper>
              <CustomFab
                onClick={() => helperStatus === HELPER_STATUS.LOGOUT ? (
                  dispatch(setHelperStatus(HELPER_STATUS.NONE))
                ) : ( 
                  dispatch(setHelperStatus(HELPER_STATUS.LOGOUT)),
                  dispatch(setShowDMRoom(false)),
                  dispatch(setShowDMList(false))
                )}
              >
                <LogoutIcon />
              </CustomFab>
            </FabWrapper>
          )}
        </Wrapper>

        <Wrapper>
          {roomJoined && (
            <FabWrapper>
              <CustomFab
                onClick={() => helperStatus === HELPER_STATUS.VERSION ? (
                  dispatch(setHelperStatus(HELPER_STATUS.NONE))
                ) : ( 
                  dispatch(setHelperStatus(HELPER_STATUS.VERSION)),
                  dispatch(setShowDMRoom(false)),
                  dispatch(setShowDMList(false))
                )}
              >
                <HelpIcon />
              </CustomFab>
            </FabWrapper>
          )}
        </Wrapper>
      </ButtonGroup>
    </Backdrop>
  )
}
