import React, { useRef, useState, useEffect } from 'react'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

import { useAppSelector, useAppDispatch } from '../../../hooks'
import { closeCodingRunDialog } from '../../../stores/CodingRunStore'
import { DIALOG_STATUS, setDialogStatus } from '../../../stores/UserStore'

import { 
  Backdrop, Wrapper, Content, 
} from './CodingRunStyle'
import './CodingRun.css'

import phaserGame from '../../../PhaserGame'
import Bootstrap from '../../../scenes/Bootstrap'

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function CodingRunDialog() {
  // For communication between client and server
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap

  // My information
  const username = useAppSelector((state) => state.user.username);
  const character = useAppSelector((state) => state.user.character);
  const imgpath = `/assets/character/single/${capitalizeFirstLetter(character)}_idle_anim_19.png`;

  // Send my info to friend (client -> server)
  bootstrap.gameNetwork.sendMyInfo(username, character);

  // Friend information
  const friendname = useAppSelector((state) => state.molegame.friendName);
  const friendcharacter = useAppSelector((state) => state.molegame.friendCharacter);
  const friendimgpath = `/assets/character/single/${capitalizeFirstLetter(friendcharacter)}_idle_anim_19.png`;
  
  // Get room host information
  const host = useAppSelector((state) => state.molegame.host);
  
  const dispatch = useAppDispatch()

  const handleClose = () => {
    try {
      bootstrap.gameNetwork.leaveGameRoom()

      dispatch(closeCodingRunDialog())
      dispatch(setDialogStatus(DIALOG_STATUS.IN_MAIN))

    } catch (error) {
      console.error('Error leaving the room:', error)
    }
  }
  
  return (
    <Backdrop>
      <Wrapper>
        <IconButton
          aria-label="close dialog"
          className="close"
          onClick={ handleClose }
        >
          <CloseIcon />
        </IconButton>

        <Content>
          Coding Run
        </Content>
      </Wrapper>
    </Backdrop>
  )
}