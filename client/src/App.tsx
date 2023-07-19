import { useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'

import { useAppSelector, useAppDispatch } from './hooks'
import { DIALOG_STATUS, HELPER_STATUS } from './stores/UserStore'

import MainBgmPath from '../src/audio/bgm_main.mp3'
import MoleGameBgmPath from '../src/audio/bgm_mole.mp3'
import BrickGameBgmPath from '../src/audio/bgm_brick.mp3'
import RainGameBgmPath from '../src/audio/bgm_rain.mp3'

// ↓ Entry Dialog
import EntryDialog from './components/entrydialog/EntryDialog'
import LoginDialog from './components/entrydialog/LoginDialog'
import JoinDialog from './components/entrydialog/JoinDialog'
import WelcomeDialog from './components/entrydialog/WelcomeDialog'

// ↓ Game Dialog
import GameLobbyDialog from './components/gamedialog/GameLobbyDialog'
import GameWelcomeDialog from './components/gamedialog/GameWelcomeDialog'
import MoleGameDialog from './components/games/MoleGame/MoleGameDialog'
import BrickGameDialog from './components/games/BrickGame/BrickGameDialog'
import RainGameDialog from './components/games/RainGame/RainGameDialog'
import RankingBoardDialog from './components/games/RankingBoard/RankingBoardDialog'
// import FaceChatDialog from './components/games/FaceChatDialog'

// ↓ HelperButtonGroup Dialog
import HelperButtonGroup from './components/helperdialog/HelperButtonGroup'
import ChatDialog from './components/helperdialog/ChatDialog'
import { ConversationList } from './components/DM/DMList'
import { DMRoom } from './components/DM/DMRoom'
import UsersDialog from './components/helperdialog/UsersDialog'
import FriendsDialog from './components/helperdialog/FriendsDialog'
import LogoutDialog from './components/helperdialog/LogoutDialog'
import VersionDialog from './components/helperdialog/VersionDialog'
import MobileVirtualJoystick from './components/helperdialog/MobileVirtualJoystick'

// ↓ Profile Button & Dialog
import ProfileButton from './components/ProfileButton'
import ProfileDialog from './components/ProfileDialog'

import GlobalFont from '../public/assets/fonts/GlobalFont'
import {} from './stores/AudioStore'

axios.defaults.baseURL = 'http://3.35.67.179:2567'
console.log('axios.defaults.baseURL ', axios.defaults.baseURL);

const Backdrop = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`

function App() {
  const dispatch = useAppDispatch()
  const dialogStatus = useAppSelector((state) => state.user.dialogStatus)

  const mainBgm = useAppSelector((state) => state.audio.MainBgm)
  const moleGameBgm = useAppSelector((state) => state.audio.MoleGameBgm)
  const brickGameBgm = useAppSelector((state) => state.audio.BrickGameBgm)
  const rainGameBgm = useAppSelector((state) => state.audio.RainGameBgm)

  // ↓ Game Dialog
  const brickGameOpen = useAppSelector((state) => state.brickgame.brickGameOpen)
  const moleGameOpen = useAppSelector((state) => state.molegame.moleGameOpen)
  const rainGameOpen = useAppSelector((state) => state.rainGameDialog.rainGameOpen)
  const rankingBoardOpen = useAppSelector((state) => state.rankingboard.rankingBoardOpen)
  // const faceChatOpen = useAppSelector((state) => state.facechat.faceChatOpen)

  // ↓ HelperButtonGroup Dialog
  const helperStatus = useAppSelector((state) => state.user.helperStatus)
  const showDMList = useAppSelector((state) => state.dm.showDMList)
  const showDMRoom = useAppSelector((state) => state.dm.showDMRoom)

  useEffect(() => {
    if (
      dialogStatus === DIALOG_STATUS.LOGIN ||
      dialogStatus === DIALOG_STATUS.JOIN ||
      dialogStatus === DIALOG_STATUS.ENTRY ||
      dialogStatus === DIALOG_STATUS.WELCOME
    )
      return
    let mainBgmAudio: HTMLAudioElement | null = null
    let moleBgmAudio: HTMLAudioElement | null = null
    let rainBgmAudio: HTMLAudioElement | null = null
    let brickBgmAudio: HTMLAudioElement | null = null

    const handleAudioEnded = (audio: HTMLAudioElement) => {
      audio.pause()
      audio.currentTime = 0
      audio.play()
    }

    if (mainBgm) {
      mainBgmAudio = new Audio(MainBgmPath)
      mainBgmAudio.addEventListener('ended', () => handleAudioEnded(mainBgmAudio!))
      mainBgmAudio.play()
    }
    if (moleGameBgm) {
      moleBgmAudio = new Audio(MoleGameBgmPath)
      moleBgmAudio.addEventListener('ended', () => handleAudioEnded(moleBgmAudio!))
      moleBgmAudio.play()
    }

    if (brickGameBgm) {
      brickBgmAudio = new Audio(BrickGameBgmPath)
      brickBgmAudio.addEventListener('ended', () => handleAudioEnded(brickBgmAudio!))
      brickBgmAudio.play()
    }

    if (rainGameBgm) {
      rainBgmAudio = new Audio(RainGameBgmPath)
      rainBgmAudio.addEventListener('ended', () => handleAudioEnded(rainBgmAudio!))
      rainBgmAudio.play()
    }

    if (moleGameBgm || brickGameBgm || rainGameBgm) {
      if (mainBgmAudio) {
        mainBgmAudio.pause()
        mainBgmAudio.currentTime = 0
      }
    }
    return () => {
      if (mainBgmAudio) {
        mainBgmAudio.pause()
        mainBgmAudio.currentTime = 0
      }

      if (moleBgmAudio) {
        moleBgmAudio.pause()
        moleBgmAudio.currentTime = 0
      }

      if (brickBgmAudio) {
        brickBgmAudio.pause()
        brickBgmAudio.currentTime = 0
      }

      if (rainBgmAudio) {
        rainBgmAudio.pause()
        rainBgmAudio.currentTime = 0
      }
    }
  }, [mainBgm, moleGameBgm, brickGameBgm, rainGameBgm, dialogStatus])

  let ui: JSX.Element
  if (dialogStatus === DIALOG_STATUS.JOIN) {
    ui = <JoinDialog />
  } else if (dialogStatus === DIALOG_STATUS.LOGIN) {
    ui = <LoginDialog />
  } else if (dialogStatus === DIALOG_STATUS.WELCOME) {
    ui = <WelcomeDialog />
  } else if (dialogStatus === DIALOG_STATUS.IN_MAIN) {
    ui = (
      <>
        {helperStatus === HELPER_STATUS.PROFILE && <ProfileDialog />}
        {helperStatus === HELPER_STATUS.CHAT && <ChatDialog />}
        {/* {helperStatus === HELPER_STATUS.DM && <ConversationList />} */}
        {helperStatus === HELPER_STATUS.USERS && <UsersDialog />}
        {helperStatus === HELPER_STATUS.FRIENDS && <FriendsDialog />}
        {helperStatus === HELPER_STATUS.LOGOUT && <LogoutDialog />}
        {helperStatus === HELPER_STATUS.VERSION && <VersionDialog />}
        {showDMList && <ConversationList />}
        {showDMRoom && <DMRoom />}
        {rankingBoardOpen && <RankingBoardDialog />}
        <MobileVirtualJoystick />
        <HelperButtonGroup />
        <ProfileButton />
      </>
    )
  } else if (dialogStatus === DIALOG_STATUS.GAME_LOBBY) {
    ui = <GameLobbyDialog />
  } else if (dialogStatus === DIALOG_STATUS.GAME_WELCOME) {
    ui = <GameWelcomeDialog />
  } else if (dialogStatus === DIALOG_STATUS.IN_GAME) {
    if (brickGameOpen) ui = <BrickGameDialog />
    if (moleGameOpen) ui = <MoleGameDialog />
    if (rainGameOpen) ui = <RainGameDialog />
    // if (faceChatOpen) ui = <FaceChatDialog />
  } else {
    ui = <EntryDialog />
  }

  return (
    <Backdrop>
      <GlobalFont />
      {ui}
    </Backdrop>
  )
}

export default App
