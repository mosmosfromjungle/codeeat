import React, { useEffect, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import RainGame from './RainGame'
import { useAppSelector, useAppDispatch } from '../../../hooks'
import { DIALOG_STATUS, setDialogStatus } from '../../../stores/UserStore'
import { closeRainGameDialog } from '../../../stores/RainGameDialogStore'
import phaserGame from '../../../PhaserGame'
import Bootstrap from '../../../scenes/Bootstrap'

import {
  Backdrop,
  Wrapper,
  StartButton,
  CharacterArea,
  NameArea,
  WaitWrapper,
  FriendInfo,
  MyInfo,
  Position,
  Comment,
} from './RainGameStyle'

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const RainGameDialog = () => {
  const dispatch = useAppDispatch()
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap

  // My information
  const username = useAppSelector((state) => state.user.username)
  const character = useAppSelector((state) => state.user.character)
  const imgpath = `/assets/character/single/${capitalizeFirstLetter(character)}_idle_anim_19.png`

  // Friend information
  const you = useAppSelector((state) => state.raingame.you)
  const friendimgpath = `/assets/character/single/${capitalizeFirstLetter(
    you.character
  )}_idle_anim_19.png`

  const isReady = useAppSelector((state) => state.raingame.rainGameReady)
  const inProgress = useAppSelector((state) => state.raingame.rainGameInProgress)
  const sessionId = useAppSelector((state) => state.user.sessionId)
  const host = useAppSelector((state) => state.raingame.host)
  const isHost = username === host

  bootstrap.gameNetwork.sendMyInfoToServer(username, character)

  // const handleStartGame = () => {
  //   console.log('handleStartGame')
  //   if(isReady && isHost){
  //     bootstrap.gameNetwork.startRainGame()
  // }
  // }

  const handleClose = () => {
    try {
      bootstrap.gameNetwork.leaveGameRoom()
      dispatch(closeRainGameDialog())
      dispatch(setDialogStatus(DIALOG_STATUS.IN_MAIN))
    } catch (error) {
      console.error('Error leaving the room:', error)
    }
  }

  return (
    <Backdrop>
      <Wrapper>
        <IconButton aria-label="close dialog" className="close" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
        <RainGame />
      </Wrapper>
    </Backdrop>
  )
}

export default RainGameDialog
