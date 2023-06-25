import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'

import { useAppSelector, useAppDispatch } from '../../hooks'
import { closeFaceChatDialog } from '../../stores/FaceChatStore'
import { DIALOG_STATUS, setDialogStatus } from '../../stores/UserStore'

import phaserGame from '../../PhaserGame'
import Bootstrap from '../../scenes/Bootstrap'

import Video from '../Video'

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 16px 180px 16px 16px;
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
  box-shadow: 0px 0px 5px #0000006f;

  .close {
    position: absolute;
    top: 16px;
    right: 16px;
  }
`

const VideoGrid = styled.div`
  flex: 1;
  min-height: 0;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));

  .video-container {
    position: relative;
    background: black;
    border-radius: 8px;
    overflow: hidden;

    video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      object-fit: contain;
    }

    .player-name {
      position: absolute;
      bottom: 16px;
      left: 16px;
      color: #fff;
      overflow: hidden;
      text-overflow: ellipsis;
      text-shadow: 0 1px 2px rgb(0 0 0 / 60%), 0 0 2px rgb(0 0 0 / 30%);
      white-space: nowrap;
    }
  }
`

function VideoContainer({ playerName, stream, muted }) {
  let is_me = false;
  if (muted === 'true') is_me = true;

  return (
    <div className="video-container">
      <Video srcObject={stream} autoPlay muted={is_me}></Video>
      {playerName && <div className="player-name">{playerName}</div>}
    </div>
  );
}

export default function FaceChatDialog() {
  const dispatch = useAppDispatch()
  
  const playerNameMap = useAppSelector((state) => state.user.playerNameMap);
  const faceChatManager = useAppSelector((state) => state.facechat.faceChatManager);
  const myStream = useAppSelector((state) => state.facechat.myStream);
  const peerStreams = useAppSelector((state) => state.facechat.peerStreams);

  const handleClose = () => {
    try {
      faceChatManager?.startFaceChat();

      const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
      bootstrap.gameNetwork.leaveGameRoom()
      dispatch(closeFaceChatDialog())
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

        <div className="toolbar">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              if (faceChatManager?.myStream) {
                faceChatManager?.stopFaceChat();

              } else {
                faceChatManager?.startFaceChat();
              }
            }}
          >
            {faceChatManager?.myStream ? '나가기' : '입장하기'}
          </Button>
        </div>

        <VideoGrid>
          {myStream && <VideoContainer stream={myStream} playerName="You" muted="true" />}

          {[...peerStreams.entries()].map(([id, { stream }]) => {
            const playerName = playerNameMap.get(id);
            return (
              <VideoContainer key={id} playerName={playerName} stream={stream} muted="false" />
            );
          })}
        </VideoGrid>
      </Wrapper>
    </Backdrop>
  )
}