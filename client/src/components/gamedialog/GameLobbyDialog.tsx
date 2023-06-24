import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import { useAppSelector, useAppDispatch } from '../../hooks'
import { CustomRoomTable } from './GameRoomTable'
import { CreateRoomForm } from './CreateRoomForm'
import { RoomType } from '../../../../types/Rooms'
import { closeBrickGameDialog } from '../../stores/BrickGameStore'
import { closeMoleGameDialog } from '../../stores/MoleGameStore'
import { closeRainGameDialog } from '../../stores/RainGameStore'

import phaserGame from '../../PhaserGame'
import Bootstrap from '../../scenes/Bootstrap'
import { DIALOG_STATUS, setDialogStatus } from '../../stores/UserStore'


const Backdrop = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  gap: 60px;
  align-items: center;
`
const Wrapper = styled.div`
  background: #222639;
  border-radius: 16px;
  padding: 36px 60px;
  box-shadow: 0px 0px 5px #0000006f;
`
const CustomRoomWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: center;

  .tip {
    font-size: 18px;
  }
`
const TitleWrapper = styled.div`
  display: grid;
  width: 100%;

  .back-button {
    grid-column: 1;
    grid-row: 1;
    justify-self: start;
    align-self: center;
  }

  h1 {
    grid-column: 1;
    grid-row: 1;
    justify-self: center;
    align-self: center;
  }
`
const Title = styled.h1`
  font-size: 24px;
  color: #eee;
  text-align: center;
`


export default function GameLobbyDialog() {
  const [showCreateRoomForm, setShowCreateRoomForm] = useState(false)
  const lobbyJoined = useAppSelector((state) => state.room.lobbyJoined)
  const brickGameOpen = useAppSelector((state) => state.brickgame.brickGameOpen)
  const moleGameOpen = useAppSelector((state) => state.molegame.moleGameOpen)
  const rainGameOpen = useAppSelector((state) => state.raingame.rainGameOpen)
  const dispatch = useAppDispatch()

  useEffect(() => {
    try {
      const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
      if (brickGameOpen) bootstrap.gameNetwork.joinLobbyRoom(RoomType.BRICKLOBBY)
      if (moleGameOpen) bootstrap.gameNetwork.joinLobbyRoom(RoomType.MOLELOBBY)
      if (rainGameOpen) bootstrap.gameNetwork.joinLobbyRoom(RoomType.RAINLOBBY)
    } catch (error) {console.error(error)}
  })

  const handleClose = () => {
    try {
      const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
      bootstrap.gameNetwork.leaveLobbyRoom()
      if (brickGameOpen) dispatch(closeBrickGameDialog())
      if (moleGameOpen) dispatch(closeMoleGameDialog())
      if (rainGameOpen) dispatch(closeRainGameDialog())
      dispatch(setDialogStatus(DIALOG_STATUS.IN_MAIN))
    } catch (error) {
      console.error('Error leaving the room:', error)
    }
  }

  return (
    <>
      <Backdrop>
        <Wrapper>
          {lobbyJoined && showCreateRoomForm ? (
            <CustomRoomWrapper>
              <TitleWrapper>
                <IconButton className="back-button" onClick={() => setShowCreateRoomForm(false)}>
                  <ArrowBackIcon />
                </IconButton>
                <Title>Create Custom Room</Title>
              </TitleWrapper>
              <CreateRoomForm />
            </CustomRoomWrapper>
          ) : (
            <CustomRoomWrapper>
              <TitleWrapper>
                <Title>
                  Game Selection
                </Title>
              </TitleWrapper>
              <CustomRoomTable />
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setShowCreateRoomForm(true)}
              >
                Create new room
              </Button>
            </CustomRoomWrapper>
          )}
          <IconButton
            aria-label="close dialog"
            className="close"
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </Wrapper>
      </Backdrop>
    </>
  )
}