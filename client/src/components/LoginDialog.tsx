import React, { useState } from 'react'
import styled from 'styled-components'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import 'swiper/css'
import 'swiper/css/navigation'

import { useAppSelector, useAppDispatch } from '../hooks'
import { setLoggedIn } from '../stores/UserStore'
import { setRoomJoined } from '../stores/RoomStore'

import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'
import Bootstrap from '../scenes/Bootstrap'

const Backdrop = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  gap: 60px;
  align-items: center;
  font-family: Font_DungGeun;
`

const Wrapper = styled.form`
  background: #222639;
  border-radius: 16px;
  padding: 36px 60px;
  box-shadow: 0px 0px 5px #0000006f;
`

const Title = styled.p`
  margin: 5px;
  font-size: 50px;
  color: #c2c2c2;
  text-align: center;
  font-family: Font_DungGeun;
`

const Content = styled.div`
  margin: 36px 36px;

  TextField {
    font-size: 20px;
    font-family: Font_DungGeun;
  }
`

const Warning = styled.div`
  margin-top: 30px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 3px;
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

const ProgressBar = styled(LinearProgress)`
  width: 360px;
`

const ProgressBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  h3 {
    color: #33ac96;
  }
`

export default function LoginDialog() {
  const [id, setId] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const [idFieldEmpty, setIdFieldEmpty] = useState<boolean>(false)
  const [passwordFieldEmpty, setPasswordFieldEmpty] = useState<boolean>(false)

  const [showSnackbar, setShowSnackbar] = useState(false)

  const dispatch = useAppDispatch()
  
  const videoConnected = useAppSelector((state) => state.user.videoConnected)
  const roomJoined = useAppSelector((state) => state.room.roomJoined)
  const lobbyJoined = useAppSelector((state) => state.room.lobbyJoined)
  const game = phaserGame.scene.keys.game as Game

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (id === '') {
      setIdFieldEmpty(true)

    } else if (password === '') {
      setPasswordFieldEmpty(true)
      
    } else {
      if (lobbyJoined) {
        const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
        bootstrap.network
          .joinOrCreatePublic()
          .then(() => bootstrap.launchGame())
          .catch((error) => console.error(error))
      } else {
        setShowSnackbar(true)
      }

      // TODO: It need to set the information with login api response data.
      if (roomJoined) {
        // console.log('Join! Id:', id, 'Avatar:', avatars[avatarIndex].name)
        game.registerKeys()
        game.myPlayer.setPlayerName(id)
        game.myPlayer.setPlayerTexture('adam')
        game.network.readyToConnect()
        dispatch(setLoggedIn(true))
      }
    }
  }

  return (
    <>
      <Backdrop>
        <Wrapper onSubmit={handleSubmit}>
          <Title>Login</Title>
            <Content>
              <TextField
                autoFocus
                fullWidth
                label="아이디"
                variant="outlined"
                color="secondary"
                error={idFieldEmpty}
                helperText={idFieldEmpty && '아이디를 입력해주세요 !'}
                onInput={(e) => {
                  setId((e.target as HTMLInputElement).value)
                }}
              />
              <TextField
                fullWidth
                label="패스워드"
                variant="outlined"
                color="secondary"
                error={passwordFieldEmpty}
                helperText={passwordFieldEmpty && '패스워드를 입력해주세요 !'}
                onInput={(e) => {
                  setPassword((e.target as HTMLInputElement).value)
                }}
              />
              
              <FormControlLabel
                control={
                  <Checkbox 
                    name="loginCheck"
                  />
                }
                label="로그인 상태 유지"
              />

              <Content>
                {!videoConnected && (
                  <Warning>
                    <Alert variant="outlined" severity="warning">
                      <AlertTitle>Warning</AlertTitle>
                      No webcam/mic connected - <strong>connect one for best experience!</strong>
                    </Alert>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => {
                        game.network.webRTC?.getUserMedia()
                      }}
                    >
                      Connect Webcam
                    </Button>
                  </Warning>
                )}

                {videoConnected && (
                  <Warning>
                    <Alert variant="outlined">Webcam connected!</Alert>
                  </Warning>
                )}
              </Content>
            </Content>
          <Bottom>
            <Button variant="contained" size="large" type="submit">
              Login
            </Button>
          </Bottom>
        </Wrapper>
        
        {!lobbyJoined && (
          <ProgressBarWrapper>
            <h3> Connecting to server...</h3>
            <ProgressBar color="secondary" />
          </ProgressBarWrapper>
        )}
      </Backdrop>
    </>
  )
}
