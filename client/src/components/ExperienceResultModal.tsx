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
  font-size: 50px;
  font-family: Font_DungGeun;
`

const Content = styled.div`
  margin: 40px;
  font-size: 35px;
  font-family: Font_DungGeun;
`

const Special = styled.span`
  color: #f9f871;
  font-height: bold;
  margin-bottom: 10px;
`

const Description = styled.span`
  color: white;
  font-size: 30px;
  line-height: 1.5;
`

const GameDescription = styled.div`
  margin-top: 20px;
  // display: flex;
  // flex-direction: row;
  // text-align: center;

  h3 {
    text-align: center;
    font-size: 30px;
    margin: 0 15px;
    line-height: 1.5;
  }
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

const ExperienceResultModal = 
  ({ open, handleClose, winner }: { open: any; handleClose: any, winner: any }) => {

  const [userName, setUserName] = useState<string>()
  const [oldUserExp, setOldUserExp] = useState<number>()
  const [userLevel, setUserLevel] = useState<string>()
  const [currentExp, setCurrentExp] = useState<number>()
  const [requiredExp, setRequiredExp] = useState<number>()
  const [winnerResult, setWinnerResult] = useState<string>()

  useEffect(() => {
    ;(async () => {
      getMyProfile()
        .then((response) => {
          if (!response) return
          const {
            username,
            userLevel,
            currentExp,
            requiredExp,
          } = response
          

          setUserName(username)
          setUserLevel(userLevel)
          setCurrentExp(currentExp)
          setRequiredExp(requiredExp)

          if (winner === true) {
            setOldUserExp(currentExp - 7)
            setWinnerResult("승리했습니다!")
          } else if (winner === false) {
            setOldUserExp(currentExp - 3)
            setWinnerResult('패배했습니다!')
          } else {
            setOldUserExp(currentExp - 5)
            setWinnerResult('무승부입니다!')
          }
        })
        .catch((error) => {
          console.error(error)
        })
    })()
  }, [])

  return (
    <Wrapper>
      <Title>
        {winnerResult}
      </Title>
      <Content>
        <Special>[{ userName }]</Special>님의 현재 레벨과 남은 경험치입니다.<br/><br/>
         <Description>
          현재 레벨 : Level <Special>{userLevel}</Special><br/>
          남은 경험치 : <Special>{requiredExp - currentExp}</Special> XP<br/>
        </Description>
        <GameDescription>
          <h3 style={{ color: 'yellowgreen' }}>초록: 기존 XP</h3>
          <h3 style={{ color: '#00b4d8' }}>파랑: 획득 XP</h3>
        </GameDescription>
      </Content>

      <Experience>
        <ExperienceBar oldExperience={oldUserExp} currentExperience={currentExp} experienceToNextLevel={requiredExp} />
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

