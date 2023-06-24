import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useAppDispatch, useAppSelector } from '../../hooks';
import styled from 'styled-components'
import Game from '../../scenes/Game';
import phaserGame from '../../PhaserGame';
import Cookies from 'universal-cookie';
import { setShowDMList } from '../../stores/DMboxStore';
const cookies = new Cookies();

export default function HeadAppBar() {
  const game = phaserGame.scene.keys.game as Game;
  const dispatch = useAppDispatch();
  const friendName = useAppSelector((state) => state.dm.friendName);
  const friendId = useAppSelector((state) => state.dm.friendId);
  const userId = useAppSelector((state) => state.user.userId) || cookies.get('userId');

  return (
    <DMtop>
      <DirtyTalk>
        <IconButton
          onClick={() => {
            dispatch(setShowDMList(true));
          }}
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 0 }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>

        <TitleText>{friendName}</TitleText>
        </DirtyTalk>
        <MyButton
          color='white'
          hoverColor='pink'
          onClick={(event) => {
            event.preventDefault();
            game.network2.deleteFriend(userId, friendId);
            dispatch(setShowDMList);
          }}
        >
          친구삭제
        </MyButton>
      
    </DMtop>
  );
}

const DirtyTalk = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;
const DMtop = styled.div`
  background: skyblue;
  padding: 0px 20px 0px 20px;
  font-size: 28px;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  font-weight: bold;
  display: flex;
  height: 60px;
  flex-direction: row;
  alsign-items: center;
  justify-content: space-between;
`;

const TitleText = styled.div`
  font-size: 23px;
`;

interface MyButtonProps {
  color?: string;
  hoverColor?: string;
}

const MyButton = styled.button<MyButtonProps>`
  width: auto;
  height: 40px;
  font-size: 1.2rem;
  font-weight: 500;
  font-family: 'Ycomputer-Regular';
  border-radius: 10px;
  border: none;
  background-color: ${(props) => (props.color ? props.color : 'white')};
  margin: 10px 5px 10px 10px;

  &:hover {
    background-color: ${(props) => (props.hoverColor ? props.hoverColor : 'black')};
    color: white
  }
`;
