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
import { closeRainGameDialog } from '../../stores/RainGameDialogStore'
import { closeFaceChatDialog } from '../../stores/FaceChatStore'

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
  padding: 40px 60px;
  box-shadow: 0px 0px 5px #0000006f;

  .close {
    position: absolute;
    top: 10px;
    right: 10px;
  }
`

const NewCustomRoomWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: center;
  width: 450px;
`

const CustomRoomWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: center;
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
  color: #eee;
  text-align: center;
  font-size: 30px;
  font-family: Font_DungGeun;
`

const RoomButton = styled.div`
  Button {
    margin-bottom: 30px;
    font-size: 20px;
    font-family: Font_DungGeun;
  }
`

export default function GameLobbyDialog() {
  const [showCreateRoomForm, setShowCreateRoomForm] = useState(false)
  const lobbyJoined = useAppSelector((state) => state.room.lobbyJoined)
  const brickGameOpen = useAppSelector((state) => state.brickgame.brickGameOpen)
  const moleGameOpen = useAppSelector((state) => state.molegame.moleGameOpen)
  const rainGameOpen = useAppSelector((state) => state.rainGameDialog.rainGameOpen)
  const faceChatOpen = useAppSelector((state) => state.facechat.faceChatOpen)

  const dispatch = useAppDispatch()

  const handleClose = () => {
    try {
      const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
      bootstrap.gameNetwork.leaveLobbyRoom()
      if (brickGameOpen) dispatch(closeBrickGameDialog())
      if (moleGameOpen) dispatch(closeMoleGameDialog())
      if (rainGameOpen) dispatch(closeRainGameDialog())
      if (faceChatOpen) dispatch(closeFaceChatDialog())

      dispatch(setDialogStatus(DIALOG_STATUS.IN_MAIN))
    } catch (error) {
      console.error('Error leaving the room:', error)
    }
  }

  return (
    <>
      <Backdrop>
        <Wrapper>
          <IconButton
            aria-label="close dialog"
            className="close"
            onClick={ handleClose }
          >
            <CloseIcon />
          </IconButton>

          {lobbyJoined && showCreateRoomForm ? (
            <NewCustomRoomWrapper>
              <TitleWrapper>
                  <IconButton className="back-button" onClick={() => setShowCreateRoomForm(false)}>
                    <ArrowBackIcon />
                  </IconButton>
                <Title>새로운 게임방 만들기</Title>
              </TitleWrapper>
              <CreateRoomForm />
            </NewCustomRoomWrapper>
          ) : (
            <CustomRoomWrapper>
              <TitleWrapper>
                <Title>
                  방 선택
                </Title>
              </TitleWrapper>
              <CustomRoomTable />
              <RoomButton>
                <Button
                  variant="contained"
                  size="large" 
                  onClick={() => setShowCreateRoomForm(true)}
                >
                  게임방 만들기
                </Button>
              </RoomButton>
            </CustomRoomWrapper>
          )}
        </Wrapper>
      </Backdrop>
    </>
  )
}