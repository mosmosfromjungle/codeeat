import React, { useState } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormHelperText from '@mui/material/FormHelperText'
import ArrowBack from '@mui/icons-material/ArrowBack'

import { useAppSelector, useAppDispatch } from '../../hooks'
import { DIALOG_STATUS, setDialogStatus, setUserId, setUsername, setCharacter, setUserLevel, setAccessToken } from '../../stores/UserStore'

import phaserGame from '../../PhaserGame'
import Game from '../../scenes/Game'
import Bootstrap from '../../scenes/Bootstrap'

import { login, LoginRequest } from '../../apicalls/auth'


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
  margin: 50px 50px;
`
const Warning = styled.div`
  margin-top: 30px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  const [userIdError, setUserIdError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  const dispatch = useAppDispatch()
  
  const videoConnected = useAppSelector((state) => state.user.videoConnected)
  const lobbyJoined = useAppSelector((state) => state.room.lobbyJoined)
  const game = phaserGame.scene.keys.game as Game

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // reset the error message
    setIdFieldEmpty(false)
    setPasswordFieldEmpty(false)

    event.preventDefault()

    if (id === '') {
      setIdFieldEmpty(true);
    } else if (password === '') {
      setPasswordFieldEmpty(true);
    } else {
      const body: LoginRequest = {
        userId: id,
        password: password,
      }
      login(body).then((response) => {
        const { status, payload } = response
        if (status === 200) {
          const token = payload.accessToken
          if (token) {
            dispatch(setAccessToken(token)) // FIXME: User Store에 엑세스 토큰을 저장하는 이유를 모르겠음. axios header에 설정하는걸로 부족한가?
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          }
          if (lobbyJoined) {
            const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
            bootstrap.network
              .joinOrCreatePublic()
              .then(() => bootstrap.launchGame())
              .catch((error) => console.error(error))
            dispatch(setDialogStatus(DIALOG_STATUS.WELCOME))
            dispatch(setUserId(payload.userId))
            dispatch(setUsername(payload.username))
            dispatch(setCharacter(payload.character))
            dispatch(setUserLevel(payload.userLevel))
            bootstrap.dmNetwork.whoAmI(payload.username)
              
            setTimeout(() => {
              dispatch(setDialogStatus(DIALOG_STATUS.WELCOME));
            }, 100);
          }
        }
      }).catch((error) => {
        const { status, message } = error.response.data
        if (status === 409) {
          setUserIdError(message);
        } else if (status === 410) {
          setPasswordError(message);
        }
      })
    }    
  }

  const handleBack = () => {
    dispatch(setDialogStatus(DIALOG_STATUS.ENTRY))
  }

  return (
    <>
      <Backdrop>
        <Wrapper onSubmit={handleSubmit}>
          <IconButton
            className="back"
            onClick={ handleBack }
          >
            <ArrowBack />
          </IconButton>
          
          <Title>로그인</Title>
          <Content>
            <TextField
              autoFocus
              fullWidth
              label="아이디"
              variant="outlined"
              color="secondary"
              margin="dense"
              error={idFieldEmpty || !!userIdError}
              helperText={idFieldEmpty ? '아이디를 입력해주세요 !' : userIdError}
              onInput={(e) => {
                setId((e.target as HTMLInputElement).value)
                setUserIdError('')
              }}
            />
            
            <FormControl 
              variant="outlined"
              fullWidth
              color='secondary'
              error={passwordFieldEmpty || !!passwordError}
              margin="dense">
              <InputLabel htmlFor="outlined-adornment-password">비밀번호</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="비밀번호"
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                onInput={(e) => {
                  setPassword((e.target as HTMLInputElement).value);
                  setPasswordError('')
                }}
              />
              <FormHelperText id="my-helper-text">{passwordFieldEmpty ? '비밀번호를 입력해주세요 !' : passwordError}</FormHelperText>
            </FormControl>
          </Content>

          <Content>
            {!videoConnected && (
              <Warning>
                <Alert variant="outlined" severity="warning">
                  <AlertTitle>아차!</AlertTitle>
                  비디오와 마이크가 연결되지 않았어요.<br></br>
                  <strong>연결하면 친구들과 대화할 수 있어요!</strong></Alert>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    game.network.webRTC?.getUserMedia()
                  }}
                >
                  비디오 연결하기
                </Button>
              </Warning>
            )}

            {videoConnected && (
              <Warning>
                <Alert variant="outlined">Webcam connected!</Alert>
              </Warning>
            )}
          </Content>
          <Bottom>
            <Button variant="contained" size="large" type="submit">
              로그인
            </Button>
          </Bottom>
        </Wrapper>
        
        {!lobbyJoined && (
          <ProgressBarWrapper>
            <h3>서버와 연결중 ...</h3>
            <ProgressBar color="secondary" />
          </ProgressBarWrapper>
        )}
      </Backdrop>
    </>
  )
}
