import { useState } from 'react'
import styled from 'styled-components'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

import phaserGame from '../PhaserGame'
import Bootstrap from '../scenes/Bootstrap'

import { useAppSelector, useAppDispatch } from '../hooks'
import { setShowLogin, setShowJoin } from '../stores/UserStore'

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

const Wrapper = styled.div`
  background: #222639;
  border-radius: 16px;
  padding: 36px 60px;
  box-shadow: 0px 0px 5px #0000006f;
`

const Title = styled.h1`
  font-size: 200px;
  color: #eee;
  text-align: center;
  font-family: Font_DungGeun;
  height: 200px;
`

const Content = styled.div`
  display: flex;
  gap: 20px;
  margin: 20px 0;
  align-items: center;
  justify-content: center;

  img {
    border-radius: 8px;
    height: 120px;
  }

  button {
    font-size: 20px;
    font-family: Font_DungGeun;
  }
`

const ImageContent = styled.div`
  display: flex;
  gap: 20px;
  margin: 20px 0;
  align-items: center;
  justify-content: center;

  img {
    border-radius: 8px;
    height: 90px;
    margin: 0px 0px 20px 0px;
  }
`

export default function WelcomeDialog() {
  const [showSnackbar, setShowSnackbar] = useState(false)
  const lobbyJoined = useAppSelector((state) => state.room.lobbyJoined)

  const dispatch = useAppDispatch()

  const gotoLoginPage = () => {
    if (lobbyJoined) {
      const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
      bootstrap.network
        .joinOrCreatePublic()
        .then(() => bootstrap.launchGame())
        .catch((error) => console.error(error))
    } else {
      setShowSnackbar(true)
    }
    
    dispatch(setShowLogin(true))
  }

  const gotoJoinPage = () => {
    dispatch(setShowJoin(true))
  }

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => {
          setShowSnackbar(false)
        }}
      >
        <Alert
          severity="error"
          variant="outlined"
          // overwrites the dark theme on render
          style={{ background: '#fdeded', color: '#7d4747' }}
        >
          Trying to connect to server, please try again!
        </Alert>
      </Snackbar>
      <Backdrop>
        <Wrapper>
          {(
            <>
              <Title>CodeEAT</Title>
              <ImageContent>
                <img src="/assets/character/single/Adam_idle_anim_24.png"></img>
                <img src="/assets/character/single/Ash_idle_anim_24.png"></img>
                <img src="/assets/character/single/Lucy_idle_anim_24.png"></img>
                <img src="/assets/character/single/Nancy_idle_anim_24.png"></img>
              </ImageContent>
              <Content>
                <Button variant="contained" onClick={gotoLoginPage}>
                  로그인
                </Button>
                <Button variant="contained" onClick={gotoJoinPage}>
                  회원가입
                </Button>
              </Content>
            </>
          )}
        </Wrapper>
      </Backdrop>
    </>
  )
}
