import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import Button from '@mui/material/Button'
import { getMyProfile } from '../apicalls/auth'
import ExperienceBar from './ExperienceBar'

const Wrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #222639;
  border-radius: 24px;
  box-shadow: 0px 10px 24px #0000006f;
  padding: 50px;
  z-index: 1000;
  color: #eee;
  text-align: center;
  width: 40%;
`

const Title = styled.div`
  color: #f9f871;
  margin: 20px;
  font-size: 35px;
`

const Content = styled.div`
  margin: 40px;
  font-size: 25px;
  font-family: Font_DungGeun;
`

const Special = styled.span`
  color: #f9f871;
  font-height: bold;
`

const Experience = styled.div`
  margin: 20px;
`

const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  Button {
    margin-top: 20px;
    font-size: 20px;
    font-family: Font_DungGeun;
  }
`

const ExperienceResultModal = ({ open, handleClose }: { open: any; handleClose: any }) => {
  const [userName, setUserName] = useState<string>()
  const [userLevel, setUserLevel] = useState<string>()
  const [currentExp, setCurrentExp] = useState<number>()
  const [requiredExp, setRequiredExp] = useState<number>()

  useEffect(() => {
    ;(async () => {
      getMyProfile()
        .then((response) => {
          if (!response) return
          const { username, userLevel, currentExp, requiredExp } = response
          setUserName(username);
          setUserLevel(userLevel)
          setCurrentExp(currentExp)
          setRequiredExp(requiredExp)
        })
        .catch((error) => {
          console.error(error)
        })
    })()
  }, [])

  return (
    <Wrapper>
      <Title>
        Game Over!
      </Title>

      <Content>
        [{ userName }]님의 현재 레벨과 경험치입니다.<br/><br/>
        현재 레벨 : Level <Special>{userLevel}</Special><br/>
        현재 경험치 : <Special>{currentExp}</Special> XP<br/>
      </Content>

      <Experience>
        <ExperienceBar currentExperience={currentExp} experienceToNextLevel={requiredExp} />
      </Experience>

      <Bottom>
        <Button variant="contained"
          size="large"
          onClick={ handleClose }
        >
          게임 종료
        </Button>
      </Bottom>
    </Wrapper>
  )
}

export default ExperienceResultModal

