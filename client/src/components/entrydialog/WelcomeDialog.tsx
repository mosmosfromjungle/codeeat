import React, { useEffect, useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import { useAppSelector, useAppDispatch } from '../../hooks'
import { setDialogStatus, setUserId, setUsername, setCharacter, setUserLevel, DIALOG_STATUS } from '../../stores/UserStore'

import Adam from '../../images/login/Adam_login.png'
import Ash from '../../images/login/Ash_login.png'
import Lucy from '../../images/login/Lucy_login.png'
import Nancy from '../../images/login/Nancy_login.png'

import phaserGame from '../../PhaserGame'
import Game from '../../scenes/Game'
import Bootstrap from '../../scenes/Bootstrap'

import { authenticateUser } from '../../apicalls/auth'


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
  padding: 36px 60px;
  box-shadow: 0px 0px 5px #0000006f;
`
const Title = styled.h3`
  margin: 5px;
  font-size: 25px;
  color: #c2c2c2;
  text-align: center;
`
const Content = styled.div`
  display: flex;
  margin: 36px 0;
`
const Left = styled.div`
  margin-right: 48px;
`
const ImgContainer = styled.div`
    width: 160px;
    height: 220px;
    background: #dbdbe0;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;  

    img {
        display: block;
        width: 95px;
        height: 136px;
        object-fit: contain;
    }
`
const Right = styled.div`
  width: 310px;

  h1 {
    margin: 10px 0 0 10px;
  }
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
const Warning = styled.div`
  margin-top: 30px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const avatars = [
  { name: 'adam', img: Adam },
  { name: 'ash', img: Ash },
  { name: 'lucy', img: Lucy },
  { name: 'nancy', img: Nancy },
]

export default function WelcomeDialog() {
  const [name, setName] = useState<string>('UNKNOWN');
  const [avatarIndex, setAvatarIndex] = useState<number>(0)

  const dispatch = useAppDispatch()

  // const lobbyJoined = useAppSelector((state) => state.room.lobbyJoined)
  const roomJoined = useAppSelector((state) => state.room.roomJoined)
  const videoConnected = useAppSelector((state) => state.user.videoConnected)

  // const game = phaserGame.scene.keys.game as Game

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const game = phaserGame.scene.keys.game as Game
    game.registerKeys()
    dispatch(setDialogStatus(DIALOG_STATUS.IN_MAIN))
  }

  useEffect(() => {
    authenticateUser().then((result) => {
      if (result.status === 200) {
        const { payload } = result
        if (roomJoined) {
          /* Register to Phaser */
          const game = phaserGame.scene.keys.game as Game
          game.myPlayer.setPlayerName(payload.username)
          game.myPlayer.setPlayerTexture(payload.character)
          game.network.readyToConnect()
          /* Redux Store */
          dispatch(setUserId(payload.userId))
          dispatch(setUsername(payload.username))
          dispatch(setCharacter(payload.character))
          dispatch(setUserLevel(payload.userLevel))
          /* Set on screen */
          const index = avatars.findIndex((avatar) => avatar.name === payload.character);
          setAvatarIndex(index)
          setName(payload.username)
        }
      }
    }).catch((error) => {
      // TODO: 실패하는 경우 Entry 화면으로 다시 가기 + Toast 메세지를 띄울 수 있으면 최고 
      console.log(error)
    })
  })

  return (
    <>
    <GlobalStyle />
    <Wrapper onSubmit={handleSubmit}>
      <Title>코드잇에 온 걸 환영합니다!</Title>
      <Content>
        <Left>
          <ImgContainer>
            <img className="character-avatar" 
                src={avatars[avatarIndex].img} 
                alt={avatars[avatarIndex].name} /> 
          </ImgContainer>
        </Left>
        <Right>
            <h1 style={{ fontSize: '24px' }}>{name} 님</h1>
          {!videoConnected && (
            <Warning>
              <Alert variant="outlined" severity="warning">
                <AlertTitle>아차!</AlertTitle>
                비디오와 마이크가 연결되지 않았어요.<br></br>
                <strong>연결하면 친구들과 대화할 수 있어요!</strong>
              </Alert>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  game.network.webRTC?.getUserMedia()
                }}>
                비디오 연결하기
              </Button>
            </Warning>
          )}
          {videoConnected && (
            <Warning>
              <Alert variant="outlined"> 마이크도 쓸 수 있어요!</Alert>
            </Warning>
          )}
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
