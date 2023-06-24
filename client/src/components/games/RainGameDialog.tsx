import React from 'react'
import styled from 'styled-components'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

import { useAppSelector, useAppDispatch } from '../../hooks'
import { DIALOG_STATUS, setDialogStatus } from '../../stores/UserStore'
import { closeRainGameDialog } from '../../stores/RainGameStore'
import RainGame from './RainGame'
import * as Colyseus from "colyseus.js";


import phaserGame from '../../PhaserGame'
import Bootstrap from '../../scenes/Bootstrap'

// import * as Colyseus from "colyseus.js";
// var client = new Colyseus.Client('ws://localhost:5173');

// 원래 패딩 : 16px, 180px, 16px, 10px
const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  padding: 16px 180px 16px 10px; 
  width: 100%;
  height: 100%;
`
const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: #222639;
  border-radius: 16px;
  padding: 16px;
  color: #eee;
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: max-content;

  .close {
    position: absolute;
    top: 0px;
    right: 0px;
  }
`

const RainGameWrapper = styled.div`
  flex: 1;
  border-radius: 25px;
  overflow: hidden;
  margin-right: 25px;

  iframe {
    width: 100%;
    height: 100%;
    background: #fff;
  }
`

export default function RainGameDialog() {
  const dispatch = useAppDispatch()

  const handleClose = () => {
    try {
      const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
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
        <RainGame />
        {<IconButton
          aria-label="close dialog"
          className="close"
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>}
      </Wrapper>
    </Backdrop>
  )
}
