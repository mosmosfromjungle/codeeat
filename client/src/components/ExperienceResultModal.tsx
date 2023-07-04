import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import Button from '@mui/material/Button'
import { getMyProfile } from '../apicalls/auth'
import ExperienceBar from './ExperienceBar'

const TextDiv = styled.div`
  margin-bottom: 10px;
`
const Profile = styled.div`
  color: white;
  width: 200px;
  font-size: 18px;
  font-family: Font_DungGeun;
  text-align: left;
`


const ExperienceResultModal = ({ open, handleClose }: { open: any; handleClose: any }) => {
  const [userLevel, setUserLevel] = useState<string>()
  const [currentExp, setCurrentExp] = useState<number>()
  const [requiredExp, setRequiredExp] = useState<number>()
  // const [userLe, setIsModalOpen] = useState<boolean>(false)
  // const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  // const openModal = () => {
  //   setTimeout(() => {
  //     setIsModalOpen(true)
  //   }, 200)
  // }

  // const closeModal = () => {
  //   setIsModalOpen(false)
  // }

  useEffect(() => {
    ;(async () => {
      getMyProfile()
        .then((response) => {
          if (!response) return
          const { userLevel, currentExp, requiredExp } = response
          console.log("유저레벨"+ userLevel)
          console.log("현재경험치" + currentExp)
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
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#222639',
        borderRadius: '24px',
        boxShadow: '0px, 10px, 24px, #0000006f',
        padding: '50px',
        zIndex: 1000,
        fontSize: '15px',
        color: '#eee',
        textAlign: 'center',
        fontFamily: 'Font_DungGeun',
      }}
    >
      <div>
        <div>
          {/* <img
            src={`../../public/assets/character/single/${friendCharacter}_idle_anim_19.png`}
            alt=""
          /> */}
          <div>
            <h2>Lv: {userLevel}</h2>
            <h2>현재경험치 : {currentExp}</h2>
            <ExperienceBar currentExperience={currentExp} experienceToNextLevel={requiredExp} />
          </div>
        </div>
        {/* <>
          <TextDiv>
            <Profile>
              학년: 3 <br />
              <br />
              학교: 3 <br />
              <br />
              자기소개: 3 <br />
              <br />
            </Profile>
          </TextDiv>
        </> */}
      </div>
      <Button
        variant="contained"
        onClick={handleClose}
        style={{ fontWeight: 'bold', margin: 'auto' }}
      >
        확인
      </Button>
    </div>
  )
}

export default ExperienceResultModal

