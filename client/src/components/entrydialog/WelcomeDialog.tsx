import React, { useEffect, useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import { useAppSelector, useAppDispatch } from '../../hooks'
import { DIALOG_STATUS, setCharacter, setDialogStatus, setUsername } from '../../stores/UserStore'

// import Adam from '../../images/login/Adam_login.png'
// import Ash from '../../images/login/Ash_login.png'
// import Lucy from '../../images/login/Lucy_login.png'
// import Nancy from '../../images/login/Nancy_login.png'

// ***새롭게 16px 캐릭터로 변경하기 위한 코드*** //
import Noah from '../../images/login/Noah_login.png'
import Nora from '../../images/login/Nora_login.png'
import Owen from '../../images/login/Owen_login.png'
import Maya from '../../images/login/Maya_login.png'
import Jiji from '../../images/login/Jiji_login.png'
import John from '../../images/login/John_login.png'
import Mina from '../../images/login/Mina_login.png'
import Ryan from '../../images/login/Ryan_login.png'

import phaserGame from '../../PhaserGame'
import Game from '../../scenes/Game'

import welcome from '../../../public/assets/background/welcome.png'

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'CustomFont';
    src: url('/assets/fonts/DungGeunMo.woff') format('woff');
  }

  body {
    font-family: 'CustomFont', sans-serif;
    letter-spacing: 2px;
  }
`
const Wrapper = styled.form`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #222639;
  border-radius: 16px;
  padding: 36px 40px;
  box-shadow: 0px 0px 5px #0000006f;
  width: 40%;
`
const Title = styled.h3`
  margin: 5px;
  font-size: 30px;
  color: #c2c2c2;
  text-align: center;
`
const Content = styled.div`
  display: flex;
  margin: 36px 0;
`
const Left = styled.div`
  width: 50%;
  font-color: 20px;
  font-size: 20px;
`
const Right = styled.div`
  width: 50%;
  margin: 0 0 0 30px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  button {
    font-size: 20px;
    font-family: Font_DungGeun;
  }
`
const Special = styled.span`
  color: #f9f871;
  font-height: bold;
`
const Description = styled.span`
  color: white;
  font-size: 18px;
`
const Image = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
  }
`
const avatars = [
  // { name: 'adam', img: Adam },
  // { name: 'ash', img: Ash },
  // { name: 'lucy', img: Lucy },
  // { name: 'nancy', img: Nancy },

  // ***새롭게 16px 캐릭터로 변경하기 위한 코드***
  { name: 'noah', img: Noah },
  { name: 'nora', img: Nora },
  { name: 'maya', img: Maya },
  { name: 'owen', img: Owen },
  { name: 'jiji', img: Jiji },
  { name: 'john', img: John },
  { name: 'mina', img: Mina },
  { name: 'ryan', img: Ryan },
]

export default function WelcomeDialog() {
  const dispatch = useAppDispatch()
  const roomJoined = useAppSelector((state) => state.room.roomJoined)
  const username = useAppSelector((state) => state.user.username)
  const character = useAppSelector((state) => state.user.character)
  // const videoConnected = useAppSelector((state) => state.user.videoConnected)

  const index = avatars.findIndex((avatar) => avatar.name === character)
  
  const game = phaserGame.scene.keys.game as Game

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    game.myPlayer.setPlayerName(username)
    game.myPlayer.setPlayerTexture(character)
    game.network.readyToConnect() 
    dispatch(setDialogStatus(DIALOG_STATUS.IN_MAIN))
  }
  
  useEffect(() => {
    if (roomJoined) {    
      game.registerKeys()
    }
  })

  return (
    <>
    <GlobalStyle />
    <Wrapper onSubmit={handleSubmit}>
      <Title><Special>코드잇</Special>에 온 걸 환영합니다!</Title>
      <Content>
        <Left>
          <Image>
            <img src={ welcome }></img>
          </Image>
        </Left>
        <Right>
          <Description>
            { username.toUpperCase() } 님, 안녕하세요! <br/>
            여기는 키즈들의 코딩공간, 코드잇입니다. <br/><br/>

            저희 코드잇에는 세가지 게임이 있어요. <br/>
            왼쪽 맵을 확인하여 원하는 게임을 플레이해보세요 !<br/>
          </Description>
        </Right>
      </Content>
      <Bottom>
        <Button variant="contained" size="large" type="submit">
          입장하기
        </Button>
      </Bottom>
    </Wrapper>
    </>
  )
}
