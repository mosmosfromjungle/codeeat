import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import RainGame from './RainGame'
import { useAppSelector, useAppDispatch } from '../../../hooks'
import { DIALOG_STATUS, setDialogStatus } from '../../../stores/UserStore'
import { closeRainGameDialog } from '../../../stores/RainGameDialogStore'
import phaserGame from '../../../PhaserGame'
import Bootstrap from '../../../scenes/Bootstrap'

const Backdrop = styled.div`
  position: fixed;
  // top: 0;
  // left: 0;
  // width: 100vw;
  // height: 100vh;
  overflow: hidden;
  padding: 16px;
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

const StartButton = styled.button`
  width: 120px;
  height: 40px;
  margin: auto;
  font-size: 18px;
  font-weight: bold;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0;
  }
`

const UserInfo = styled.div`
  position: absolute;
  top: 16px;
  font-size: 16px;
  color: white;

  &.myInfo {
    right: 16px;
  }

  &.youInfo {
    left: 16px;
  }
`

const RainGameDialog = () => {
  const dispatch = useAppDispatch()
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
  const username = useAppSelector((state) => state.user.username)
  const character = useAppSelector((state) => state.user.character)
  const you = useAppSelector((state) => state.raingame.you)
  const isReady = useAppSelector((state) => state.raingame.rainGameReady)
  const inProgress = useAppSelector((state) => state.raingame.rainGameInProgress)
  const sessionId = useAppSelector((state) => state.user.sessionId);
  const host = useAppSelector((state) => state.raingame.host);
  const isHost = username === host;

  bootstrap.gameNetwork.sendMyInfoToServer(username, character)

  const handleStartGame = () => {
    console.log('handleStartGame')
    if(isReady && isHost){
      bootstrap.gameNetwork.startRainGame()
  }
  }

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
        { !inProgress && (
          <>
        <UserInfo className="myInfo">
          <>
            <div>Username: {username}</div>
            <div>Character: {character}</div>
          </>
        </UserInfo>
        {/* 상대방의 닉네임과 캐릭터 출력 */}
        <UserInfo className="youInfo">
          {you ? (
            <>
              <div>Username: {you.username}</div>
              <div>Character: {you.character}</div>
            </>
          ) : (
            <div>No opponent connected</div>
          )}
        </UserInfo>
        </>
        )}
        { !inProgress && <StartButton onClick={handleStartGame} disabled={!isReady || !isHost}>게임 시작</StartButton>}
        {inProgress && <RainGame />}
        <IconButton aria-label="close dialog" className="close" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Wrapper>
    </Backdrop>
  )
}

export default RainGameDialog
