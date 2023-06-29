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
  // top: 0;
  // left: 0;
  // width: 100vw;
  // height: 100vh;
  overflow: hidden;
  padding: 16px; 
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

const UserInfo = styled.div`
  position: absolute;
  top: 16px;
  font-size: 16px;
  color: white;

  &.myInfo {
    left: 16px;
  }

  &.opponentInfo {
    right: 16px;
  }
`;

const RainGameDialog = () => {
  const dispatch = useAppDispatch();
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap;

  const [showGame, setShowGame] = useState(false);
  const [clientId, setClientId] = useState(null);

  const username = useAppSelector((state) => state.user.username);
  const character = useAppSelector((state) => state.user.character);

  const users = useAppSelector((state) => state.raingame.users);
  const myInfo = users.find((user) => user.clientId === clientId);
  const opponent = users.find((user) => user.clientId !== clientId);

  useEffect(() => {
    const initializeRainGame = async () => {
      try {
        console.log("1")
        const clientId = await bootstrap.gameNetwork.sendMyInfoToServer(username, character);
        setClientId(clientId);
        await bootstrap.gameNetwork.startRainGame();
      } catch (error){

      }
    };

    initializeRainGame();
  },[]);

  useEffect(() => {
    const updatedMyInfo = users.find((user) => user.clientId === clientId);
    const updatedOpponent = users.find((user) => user.clientId !== clientId);

  }, [users]);

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
      <UserInfo className="myInfo">
  {users ? (
    <>
      <div>Username: {username}</div>
      <div>Character: {character}</div>
    </>
  ) : (
    <div>Loading..</div>
  )}
</UserInfo>
         {/* 상대방의 닉네임과 캐릭터 출력 */}
         <UserInfo className="opponentInfo">
  {opponent ? (
    <>
      <div>Username: {opponent.username}</div>
      <div>Character: {opponent.character}</div>
    </>
  ) : (
    <div>No opponent connected</div>
  )}
</UserInfo>
      {!showGame && (
          <StartButton onClick={handleStartGame}>게임 시작</StartButton>
        )}
        {showGame && <RainGame clientId={clientId}/>}
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