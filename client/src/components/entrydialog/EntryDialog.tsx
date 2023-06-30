import { useEffect, useState } from 'react'
import styled from 'styled-components'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import LinearProgress from '@mui/material/LinearProgress'
import Snackbar from '@mui/material/Snackbar'

import { useAppSelector, useAppDispatch } from '../../hooks'
import { DIALOG_STATUS, setDialogStatus } from '../../stores/UserStore'

import './Entry.css'

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
  text-align: center;
  background: #222639;
  border-radius: 24px;
  padding: 200px 120px 80px 120px;
  box-shadow: 0px 10px 24px #0000006f;
`
const Title = styled.span`
  font-size: 180px;
  color: #eee;
  text-align: center;
  font-family: Font_DungGeun;
`
const SubTitle = styled.div`
  font-size: 30px;
  color: #eee;
  font-family: Font_DungGeun;

  span {
    color: #fbb666;
    font-weight: bold;
  }
`
const ImageContent = styled.div`
  display: flex;
  gap: 30px;
  margin: 40px 0 60px 0;
  align-items: center;
  justify-content: center;

  img {
    border-radius: 8px;
    height: 90px;
  }
`
const Content = styled.div`
  display: flex;
  gap: 80px;
  margin: 20px 0;
  align-items: center;
  justify-content: center;

  img {
    border-radius: 8px;
    height: 90px;
  }

  button {
    font-size: 20px;
    font-family: Font_DungGeun;
    height: 60px;
    width: 120px;
    border-radius: 10px;
  }
`
const ProgressBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  h3 {
    color: #33ac96;
  }
`
const ProgressBar = styled(LinearProgress)`
  width: 360px;
`

// ↓ It's for character animation
let characters;
let currentCharacterIndex = 0;

function jumpCharacter() {
  const currentCharacter = characters[currentCharacterIndex];
  currentCharacter.classList.add('active');
  currentCharacter.style.animation = 'jump-animation 1s ease-in-out';

  setTimeout(() => {
    currentCharacter.classList.remove('active');
    currentCharacter.style.animation = '';

    currentCharacterIndex = (currentCharacterIndex + 1) % characters.length;
    jumpCharacter();
  }, 1000);
}

window.onload = function() {
  characters = document.querySelectorAll('.character');

  jumpCharacter();
};

export default function EntryDialog() {
  const [showSnackbar, setShowSnackbar] = useState(false)
  const lobbyJoined = useAppSelector((state) => state.room.lobbyJoined)

  const dispatch = useAppDispatch()

  const gotoLoginPage = () => {
    if (lobbyJoined) {
      dispatch(setDialogStatus(DIALOG_STATUS.LOGIN))
    } else {
      setShowSnackbar(true);
    }
  }

  const gotoJoinPage = () => {
    if (lobbyJoined) {
      dispatch(setDialogStatus(DIALOG_STATUS.JOIN))
    } else {
      setShowSnackbar(true);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!lobbyJoined) {
        setShowSnackbar(true);
      }
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [lobbyJoined]);

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => {
          setShowSnackbar(false)
        }}>
        <Alert
          severity="error"
          variant="outlined"
          // overwrites the dark theme on render
          style={{ background: '#fdeded', color: '#7d4747' }}>
          Trying to connect to server, please try again!
        </Alert>
      </Snackbar>
      <Backdrop>
        <Wrapper>
          <>
            <Title>CodeEat</Title>
            <SubTitle>
              키즈들의 코딩공간, <span>코드잇</span>
            </SubTitle>
            <ImageContent className="character-animation">
              <img className="character" src="/assets/character/single/Adam_idle_anim_24.png" alt="Adam"></img>
              <img className="character" src="/assets/character/single/Ash_idle_anim_24.png" alt="Ash"></img>
              <img className="character" src="/assets/character/single/Lucy_idle_anim_24.png" alt="Lucy"></img>
              <img className="character" src="/assets/character/single/Nancy_idle_anim_24.png" alt="Nancy"></img>
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
