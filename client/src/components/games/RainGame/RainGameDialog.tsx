import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import RainGame from './RainGame';
import { useAppSelector, useAppDispatch } from '../../../hooks';
import { DIALOG_STATUS, setDialogStatus } from '../../../stores/UserStore';
import { closeRainGameDialog } from '../../../stores/RainGameDialogStore';
import phaserGame from '../../../PhaserGame';
import Bootstrap from '../../../scenes/Bootstrap';

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
`;

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
`;

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
`;

const RainGameDialog = () => {
  const dispatch = useAppDispatch();
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap;

  const [showGame, setShowGame] = useState(false);

  useEffect(() => {
    const initializeRainGame = async () => {
      try {
        await bootstrap.gameNetwork.startRainGame();
      } catch (error){
        console.error("초기화 과정에서 에러 발생:",error);
      }
    };

    initializeRainGame();
  },[]);

  const handleStartGame = () => {
    setShowGame(true);
  };

  const handleClose = () => {
    try {
      bootstrap.gameNetwork.leaveGameRoom();
      dispatch(closeRainGameDialog());
      dispatch(setDialogStatus(DIALOG_STATUS.IN_MAIN));
    } catch (error) {
      console.error('Error leaving the room:', error);
    }
  };


  return (
    <Backdrop>
      <Wrapper>
      {!showGame && (
          <StartButton onClick={handleStartGame}>게임 시작</StartButton>
        )}
        {showGame && <RainGame />}
        {<IconButton
          aria-label="close dialog"
          className="close"
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>}
      </Wrapper>
    </Backdrop>
  );
};

export default RainGameDialog;