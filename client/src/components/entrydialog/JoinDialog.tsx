import React, { useState } from 'react'
import styled from 'styled-components'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormHelperText from '@mui/material/FormHelperText'
import ArrowBack from '@mui/icons-material/ArrowBack'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'

import Adam from '../../images/login/Adam_login.png'
import Ash from '../../images/login/Ash_login.png'
import Lucy from '../../images/login/Lucy_login.png'
import Nancy from '../../images/login/Nancy_login.png'

// ***새롭게 16px 캐릭터로 변경하기 위한 코드*** 
// import Logan from '../../images/login/Logan_login.png'
// import Kevin from '../../images/login/Kevin_login.png'
// import Zoey from '../../images/login/Zoey_login.png'
// import Emma from '../../images/login/Emma_login.png'

import { useAppSelector, useAppDispatch } from '../../hooks'
import { DIALOG_STATUS, setDialogStatus } from '../../stores/UserStore'
import { JoinRequest, join } from '../../apicalls/auth'


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
const Title = styled.p`
margin: 5px;
font-size: 50px;
color: #c2c2c2;
text-align: center;
font-family: Font_DungGeun;
`
const SubTitle = styled.h3`
  width: 160px;
  font-size: 16px;
  color: #eee;
  text-align: center;
  font-family: Font_DungGeun;
`
const Content = styled.div`
  display: flex;
  margin: 36px 0;
`
const Left = styled.div`
  margin-right: 48px;

  --swiper-navigation-size: 24px;

  .swiper {
    width: 160px;
    height: 220px;
    border-radius: 8px;
    overflow: hidden;
  }

  .swiper-slide {
    width: 160px;
    height: 220px;
    background: #dbdbe0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .swiper-slide img {
    display: block;
    width: 95px;
    height: 136px;
    object-fit: contain;
  }
`
const Right = styled.div`
  width: 300px;
  margin-top: 10px;
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

const avatars = [
  { name: 'adam', img: Adam },
  { name: 'ash', img: Ash },
  { name: 'lucy', img: Lucy },
  { name: 'nancy', img: Nancy },

  // ***새롭게 16px 캐릭터로 변경하기 위한 코드***
  // { name: 'logan', img: Logan },
  // { name: 'kevin', img: Kevin },
  // { name: 'zoey', img: Zoey },
  // { name: 'emma', img: Emma },
]

// shuffle the avatars array
for (let i = avatars.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1))
  ;[avatars[i], avatars[j]] = [avatars[j], avatars[i]]
}

export default function JoinDialog() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [passwordCheck, setPasswordCheck] = useState<string>('')
  const [nickname, setNickname] = useState<string>('')
  
  const [emailFieldEmpty, setEmailFieldEmpty] = useState<boolean>(false)
  
  const [passwordFieldEmpty, setPasswordFieldEmpty] = useState<boolean>(false)
  const [passwordCheckFieldEmpty, setPasswordCheckFieldEmpty] = useState<boolean>(false)
  const [passwordFieldNotMatch, setPasswordFieldNotMatch] = useState<boolean>(false)
  const [nicknameFieldEmpty, setNicknameFieldEmpty] = useState<boolean>(false)

  const [passwordError, setPasswordError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('')
  const [nicknameError, setNicknameError] = useState<string>('')

  const [avatarIndex, setAvatarIndex] = useState<number>(0)

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const lobbyJoined = useAppSelector((state) => state.room.lobbyJoined)
  const dispatch = useAppDispatch()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // reset the error message
    setEmailFieldEmpty(false)
    setPasswordFieldEmpty(false)
    setPasswordCheckFieldEmpty(false)
    setPasswordFieldNotMatch(false)
    setNicknameFieldEmpty(false)

    event.preventDefault()

    if (email === '') {
      setEmailFieldEmpty(true)
    } else if (password === '') {
      setPasswordFieldEmpty(true)
    } else if (passwordCheck === '') {
      setPasswordCheckFieldEmpty(true)
    } else if (password !== passwordCheck) {
      setPasswordFieldNotMatch(true)
    } else if (nickname === '') {
      setNicknameFieldEmpty(true)
    } else {
      const body: JoinRequest = {
        userId: email,
        password: password,
        username: nickname,
        character: avatars[avatarIndex].name,
      }
      join(body).then((response) => {
        if (response.status === 200) {
          dispatch(setDialogStatus(DIALOG_STATUS.LOGIN))
        }
      }).catch((error) => {
        if (error.response) {
          const { status, message } = error.response.data
          if (status === 409) {
            setEmailError(message)
          } else if (status === 410) {
            setNicknameError(message)
          }
        }
      })
    }
  }

  const handleBack = () => {
    dispatch(setDialogStatus(DIALOG_STATUS.ENTRY))
  }

  return (
    <>
      <Wrapper onSubmit={handleSubmit}>
        <IconButton
          className="back"
          onClick={ handleBack }
        >
          <ArrowBack />
        </IconButton>

        <Title>회원가입</Title>
        <Content>
          <Left>
            <SubTitle>좌우로 이동하여 캐릭터를 골라보세요 !</SubTitle>
              <Swiper
                modules={[Navigation]}
                navigation
                spaceBetween={0}
                slidesPerView={1}
                onSlideChange={(swiper) => {
                  setAvatarIndex(swiper.activeIndex)
                }}
              >
              {avatars.map((avatar) => (
                <SwiperSlide key={avatar.name}>
                  <img src={avatar.img} alt={avatar.name} />
                </SwiperSlide>
              ))}
            </Swiper>
          </Left>
          <Right>
            <TextField
              autoFocus
              fullWidth
              label="아이디"
              variant="outlined"
              color="secondary"
              margin="dense"
              error={emailFieldEmpty}
              helperText={
                (emailFieldEmpty && '아이디를 입력해주세요 !') ||
                emailError
              }
              onInput={(e) => {
                setEmail((e.target as HTMLInputElement).value)
              }}
            />

            <FormControl 
              variant="outlined"
              fullWidth
              color='secondary'
              error={passwordFieldEmpty}
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

            <FormControl 
              variant="outlined"
              fullWidth
              color='secondary'
              error={passwordCheckFieldEmpty}
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
                  setPasswordCheck((e.target as HTMLInputElement).value);
                  setPasswordError('')
                }}
              />
              <FormHelperText id="my-helper-text">{(passwordCheckFieldEmpty && '비밀번호를 입력해주세요 !') || (passwordFieldNotMatch && '비밀번호를 확인해주세요 !')}</FormHelperText>
            </FormControl>

            <TextField
              fullWidth
              label="닉네임"
              variant="outlined"
              color="secondary"
              margin="dense"
              error={nicknameFieldEmpty || !!nicknameError}
              helperText={nicknameFieldEmpty ? '닉네임을 입력해주세요 !' : nicknameError}
              onInput={(e) => {
                setNickname((e.target as HTMLInputElement).value)
              }}
            />
          </Right>
        </Content>
        <Bottom>
          <Button variant="contained" size="large" type="submit">
            가입하기
          </Button>
        </Bottom>
      </Wrapper>
      {!lobbyJoined && (
        <ProgressBarWrapper>
          <h3>서버와 연결중 ...</h3>
          <ProgressBar color="secondary" />
        </ProgressBarWrapper>
      )}
    </>
  )
}

