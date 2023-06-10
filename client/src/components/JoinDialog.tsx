import React, { useState } from 'react'
import styled from 'styled-components'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'

import Adam from '../images/login/Adam_login.png'
import Ash from '../images/login/Ash_login.png'
import Lucy from '../images/login/Lucy_login.png'
import Nancy from '../images/login/Nancy_login.png'

import { useAppDispatch } from '../hooks'
import { setShowLogin } from '../stores/UserStore'

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

const avatars = [
  { name: 'adam', img: Adam },
  { name: 'ash', img: Ash },
  { name: 'lucy', img: Lucy },
  { name: 'nancy', img: Nancy },
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
  const [nicknameFieldEmpty, setNicknameFieldEmpty] = useState<boolean>(false)

  const [setAvatarIndex] = useState<number>(0)
  const dispatch = useAppDispatch()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (email === '') {
      setEmailFieldEmpty(true)

    } else if (password === '') {
      setPasswordFieldEmpty(true)

    } else if (passwordCheck === '') {
      setPasswordCheckFieldEmpty(true)

    } else if (nickname === '') {
      setNicknameFieldEmpty(true)

    } else {
      dispatch(setShowLogin(true))
    }
  }

  return (
    <Wrapper onSubmit={handleSubmit}>
      <Title>Join Us</Title>
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
            label="이메일"
            variant="outlined"
            color="secondary"
            error={emailFieldEmpty}
            helperText={emailFieldEmpty && '이메일을 입력해주세요 !'}
            onInput={(e) => {
              setEmail((e.target as HTMLInputElement).value)
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
          <TextField
            fullWidth
            label="패스워드 확인"
            variant="outlined"
            color="secondary"
            error={passwordCheckFieldEmpty}
            helperText={passwordCheckFieldEmpty && '패스워드를 입력해주세요 !'}
            onInput={(e) => {
              setPasswordCheck((e.target as HTMLInputElement).value)
            }}
          />
          <TextField
            fullWidth
            label="닉네임"
            variant="outlined"
            color="secondary"
            error={nicknameFieldEmpty}
            helperText={nicknameFieldEmpty && '닉네임을 입력해주세요 !'}
            onInput={(e) => {
              setNickname((e.target as HTMLInputElement).value)
            }}
          />
        </Right>
      </Content>
      <Bottom>
        <Button variant="contained" color="secondary" size="large" type="submit">
          Join
        </Button>
      </Bottom>
    </Wrapper>
  )
}
