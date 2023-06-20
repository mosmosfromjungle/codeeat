import React from 'react'
import styled from 'styled-components'
import axios from 'axios'

import { useAppSelector } from './hooks'

import WelcomeDialog from './components/WelcomeDialog'
import LoginDialog from './components/LoginDialog'
import JoinDialog from './components/JoinDialog'
import ComputerDialog from './components/ComputerDialog'
import AcidRainDialog from './components/AcidRainDialog'
import MoleGameDialog from './components/MoleGameDialog'
import VideoConnectionDialog from './components/VideoConnectionDialog'
import HelperButtonGroup from './components/HelperButtonGroup'
import MobileVirtualJoystick from './components/MobileVirtualJoystick'

// ↓ HelperButtonGroup Dialog
import ChatDialog from './components/ChatDialog'
import DMDialog from './components/DMDialog'
import UserDialog from './components/UserDialog'
import LogoutDialog from './components/LogoutDialog'

// ↓ Profile Button & Dialog
import ProfileButton from './components/ProfileButton'
import ProfileDialog from './components/ProfileDialog'

import GlobalFont from '../public/assets/fonts/GlobalFont'

axios.defaults.baseURL = 'http://localhost:2567'
console.log('axios.defaults.baseURL ', axios.defaults.baseURL);

const Backdrop = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`

function App() {
  const loggedIn = useAppSelector((state) => state.user.loggedIn)
  const computerDialogOpen = useAppSelector((state) => state.computer.computerDialogOpen)
  const acidrainDialogOpen = useAppSelector((state) => state.acidrain.acidrainDialogOpen)
  const videoConnected = useAppSelector((state) => state.user.videoConnected)
  const roomJoined = useAppSelector((state) => state.room.roomJoined)
  const moleGameDialogOpen = useAppSelector((state) => state.molegame.moleGameDialogOpen)
  const showLogin = useAppSelector((state) => state.user.showLogin)
  const showJoin = useAppSelector((state) => state.user.showJoin)

  // ↓ HelperButtonGroup Dialog
  const showChat = useAppSelector((state) => state.chat.showChat)
  const showDM = useAppSelector((state) => state.chat.showDM)
  const showUser = useAppSelector((state) => state.chat.showUser)
  const showLogout = useAppSelector((state) => state.user.showLogout)

  // ↓ Profile Dialog
  const showProfile = useAppSelector((state) => state.user.showProfile)

  let ui: JSX.Element
  if (loggedIn) {
    if (computerDialogOpen) {
      ui = <ComputerDialog />

    } else if (acidrainDialogOpen) {
      ui = <AcidRainDialog />

    } else if (moleGameDialogOpen) {
      ui = <MoleGameDialog />

    } else if (showChat) {
      ui = <ChatDialog />
      
    } else if (showDM) {
      ui = <DMDialog />
      
    } else if (showUser) {
      ui = <UserDialog />
      
    } else if (showLogout) {
      ui = <LogoutDialog />
      
    } else if (showProfile) {
      ui = <ProfileDialog />
      
    } else {
      ui = (
        <>
          {!videoConnected && <VideoConnectionDialog />}
          <MobileVirtualJoystick />
        </>
      )
    }

  } else if (showLogin) {
    ui = <LoginDialog />

  } else if (showJoin) {
    ui = <JoinDialog />

  } else {
    ui = <WelcomeDialog />
  }

  return (
    <Backdrop>
      {ui}
      {/* Render HelperButtonGroup, ProfileButton if no dialogs are opened. */}
      {!computerDialogOpen && !acidrainDialogOpen && !moleGameDialogOpen && <HelperButtonGroup />}
      {!computerDialogOpen && !acidrainDialogOpen && !moleGameDialogOpen && <ProfileButton />}
      {<GlobalFont />}
    </Backdrop>
  )
}

export default App
