import { useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'

import { useAppSelector, useAppDispatch } from './hooks'
import { ENTRY_PROCESS, setEntryProcess } from './stores/UserStore'

import EntryDialog from './components/entrydialog/EntryDialog'
import LoginDialog from './components/entrydialog/LoginDialog'
import JoinDialog from './components/entrydialog/JoinDialog'
import WelcomeDialog from './components/entrydialog/WelcomeDialog'

import ComputerDialog from './components/ComputerDialog'
import WhiteboardDialog from './components/WhiteboardDialog'
import MoleGameDialog from './components/MoleGameDialog'
import VideoConnectionDialog from './components/VideoConnectionDialog'
import HelperButtonGroup from './components/HelperButtonGroup'
import MobileVirtualJoystick from './components/MobileVirtualJoystick'

// ↓ HelperButtonGroup Dialog
import ChatDialog from './components/ChatDialog'
import DMDialog from './components/DMDialog'
import UserDialog from './components/UserDialog'
import LogoutDialog from './components/LogoutDialog'
import VersionDialog from './components/VersionDialog'

// ↓ Profile Button & Dialog
import ProfileButton from './components/ProfileButton'
import ProfileDialog from './components/ProfileDialog'

import GlobalFont from '../public/assets/fonts/GlobalFont'

import { authenticateUser } from './apicalls/auth';

// import Cookies from 'universal-cookie';
// const cookies = new Cookies();

// TODO: Production 서버에 옮겨가면 해당 부분 수정 필요 
axios.defaults.baseURL = 'http://localhost:2567'
console.log('axios.defaults.baseURL ', axios.defaults.baseURL);

const Backdrop = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`

function App() {
  const entryProcess = useAppSelector((state) => state.user.entryProcess)
  const entered = useAppSelector((state) => state.user.entered)
  const videoConnected = useAppSelector((state) => state.user.videoConnected)
  const audioConnected = useAppSelector((state) => state.user.audioConnected)
  const computerDialogOpen = useAppSelector((state) => state.computer.computerDialogOpen)
  const whiteboardDialogOpen = useAppSelector((state) => state.whiteboard.whiteboardDialogOpen)
  const moleGameDialogOpen = useAppSelector((state) => state.molegame.moleGameDialogOpen)

  // ↓ HelperButtonGroup Dialog
  const showChat = useAppSelector((state) => state.chat.showChat)
  const showDM = useAppSelector((state) => state.chat.showDM)
  const showUser = useAppSelector((state) => state.chat.showUser)
  const showLogout = useAppSelector((state) => state.user.showLogout)
  const showVersion = useAppSelector((state) => state.user.showVersion)

  // ↓ Profile Dialog
  const showProfile = useAppSelector((state) => state.user.showProfile)

  const dispatch = useAppDispatch()

  useEffect(() => {
    // 첫 렌더링 시, refresh token이 있다면 token 인증을 통해 entry 상태를 설정 // TODO: cookie 가져오는 부분 해결 필요 
    // const refreshToken = cookies.get('refreshToken');
    // console.log('refresh token: ', refreshToken)
    // if (refreshToken) { 
    authenticateUser()
    .then((result) => {
      if (result.status === 200) {
        dispatch(setEntryProcess(ENTRY_PROCESS.WELCOME));
      }
    })
    // }
  }, [])

  let ui: JSX.Element
  if (entered) {
    if (computerDialogOpen) {
      ui = <ComputerDialog />
    } else if (whiteboardDialogOpen) {
      ui = <WhiteboardDialog />
    } else if (moleGameDialogOpen) {
      ui = <MoleGameDialog />
    } else if (showChat) {
      ui = <ChatDialog /> // UGLY: Need to move to HelperButtonGroup 
    } else if (showDM) {
      ui = <DMDialog />   // UGLY: Need to move to HelperButtonGroup 
    } else if (showUser) {
      ui = <UserDialog /> // UGLY: Need to move to HelperButtonGroup 
    } else if (showLogout) {
      ui = <LogoutDialog />
    } else if (showVersion) {
      ui = <VersionDialog />
    } else if (showProfile) {
      ui = <ProfileDialog />  // UGLY: Need to move to HelperButtonGroup 
    } else {
      ui = (
        <>
          {!videoConnected && <VideoConnectionDialog />}
          <MobileVirtualJoystick />
        </>
      )
    }
  } else if (entryProcess === ENTRY_PROCESS.ENTRY) {
    ui = <EntryDialog />
  } else if (entryProcess === ENTRY_PROCESS.LOGIN) {
    ui = <LoginDialog />
  } else if (entryProcess === ENTRY_PROCESS.JOIN) {
    ui = <JoinDialog />
  } else {
    ui = <WelcomeDialog/>
  }

  return (
    <Backdrop>
      {ui}
      {/* Render HelperButtonGroup, ProfileButton, VersionButton if no dialogs are opened. */}
      {!computerDialogOpen && !whiteboardDialogOpen && !moleGameDialogOpen && <HelperButtonGroup />}
      {!computerDialogOpen && !whiteboardDialogOpen && !moleGameDialogOpen && <ProfileButton />}
      {<GlobalFont />}
    </Backdrop>
  )
}

export default App
