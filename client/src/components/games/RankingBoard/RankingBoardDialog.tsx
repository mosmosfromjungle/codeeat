import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'

import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'

import CloseIcon from '@mui/icons-material/Close'

import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import { PersonRemoveOutlined, MailOutlineRounded } from '@mui/icons-material'
import { Content, Header, HeaderTitle } from '../../GlobalStyle'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

import { useAppSelector, useAppDispatch } from '../../../hooks'
import { closeRankingBoardDialog } from '../../../stores/RankingBoardStore'
import { DIALOG_STATUS, setDialogStatus } from '../../../stores/UserStore'
import { getUsersRanking } from '../../../apicalls/auth'
import { IUserInfo, IUserProfile } from '../../../../../server/controllers/UserControllers/types'
// import { Backdrop, Wrapper, Content } from './RankingBoardStyle'
// import './RankingBoard.css'

import phaserGame from '../../../PhaserGame'
import Bootstrap from '../../../scenes/Bootstrap'

/* 기존 랭킹보드 style */
// const Backdrop = styled.div`
//   // position: fixed;
//   // display: flex;
//   // width: 1000px;
//   // gap: 10px;
//   // bottom: 16px;
//   // right: 16px;
//   // align-items: flex-end;
//   position: fixed;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   width: 100%;
//   height: 100%;
//   gap: 10px;
// `

// const Wrapper = styled.div`
//   height: 100%;
//   margin-top: auto;
//   position: relative;
//   width: 1000px;
//   margin: auto;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
// `

// const Content = styled.div`
//   margin: 70px auto;
// `

// const ChatHeader = styled.div`
//   position: relative;
//   height: 40px;
//   background: #000000a7;
//   border-radius: 10px 10px 0px 0px;
//   // dispaly: flex;
//   // justify-content: center;

//   .close {
//     position: absolute;
//     top: 0;
//     right: 0;
//   }
// `

// const Title = styled.div`
//   // position: absolute;
//   color: white;
//   font-size: 20px;
//   font-weight: bold;
//   top: 10px;
//   font-family: Font_DungGeun;
//   text-align: center;
//   line-height: 40px;
// `

// const ChatBox = styled(Box)`
//   // height: 580px;
//   width: 1000px;
//   overflow: auto;
//   background: #2c2c2c;
//   border: 1px solid #00000029;
//   padding: 10px 10px;
//   border-radius: 0px 0px 10px 10px;

//   Button {
//     font-size: 17px;
//     font-family: Font_DungGeun;
//   }
// `

// const UserList = styled.div`
//   display: grid;
//   // grid-template-columns: repeat(3, 1fr);
//   gap: 20px; // 이 값을 조절하여 원하는 간격을 설정하세요
//   height: 800px; 
// `

// const User = styled.div`
//   margin: 10px 10px 10px 10px;
// `

// const Profile = styled.div`
//   // border: 3px solid red;
//   margin-left: 30px;
//   // padding-left: 50px;
//   color: white;
//   font-size: 20px;
//   font-family: Font_DungGeun;
//   display: flex;
//   flex-direction: row;
//   justify-content: space-between;

//   & > div {
//     display: flex;
//     flex-direction: row;
//     justify-content: space-between;
//     gap: 100px;
//   }
// `

// const ProfileText = styled.p`
//   flex: 1;
//   text-align: center;
//   margin: 10px; // 이 값을 조절하여 원하는 간격을 설정하세요
// `

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
`
const Wrapper = styled.div`
  // width: 100%; // Adjust this as needed
  // height: 80%; // Adjust this as needed
  width: 600px;
  height: 860px;
  display: flex;
  flex-direction: column;
  justify-content: center
  align-items: center;
`
const Body = styled.div`
  flex: 1;
  height: calc(100% - 76px);
  overflow: auto;
  padding: 10px 0 0 20px;
  display: flex;
  flex-direction: column;

  .listitem && {
    flex: 0 0 auto;
    display: flex;
    justify-content: space-between;
  }
`
const ListTitle = styled.div`
  position: relative;
  color: black;
  font-size: 18px;
  font-weight: bold;
  font-family: Font_DungGeun;
  text-align: left;
  padding: 8px 0;
  //   background-color: ;
`
const NameWrapper = styled.div`
  // margin-right: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
`
const NameProfile = styled.div`
  color: black;
  font-family: Font_DungGeun;
  font-size: 20px;
  margin-left: 30px;
`
const Level = styled.div`
  font-size: 20px;
  line-height: 1;
`
const Username = styled.div`
  font-size: 24px;
  line-height: 1;
  margin: 4px 0 0 0;
`
const ProfileButton = styled.div`
  margin-left: auto;
  display: flex;
  flex-direction: row;
  Button {
    color: black;
  }
`
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


function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export default function RankingBoardDialog() {
  // For communication between client and server
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap

  // My information
  const username = useAppSelector((state) => state.user.username)
  const character = useAppSelector((state) => state.user.character)
  const imgpath = `/assets/character/single/${capitalizeFirstLetter(character)}.png`

  // Send my info to friend (client -> server)
  bootstrap.gameNetwork.sendMyInfo(username, character)

  // Friend information
  const friendname = useAppSelector((state) => state.molegame.friendName)
  const friendcharacter = useAppSelector((state) => state.molegame.friendCharacter)
  const friendimgpath = `/assets/character/single/${capitalizeFirstLetter(
    friendcharacter
  )}.png`

  // Get room host information
  const host = useAppSelector((state) => state.molegame.host)

  const [usersRankingList, setUsersRankingList] = useState<IUserInfo[]>([])
  const [isOpen, isSetOpen] = useState(false)

  const dispatch = useAppDispatch()

  const handleClose = () => {
    try {
      bootstrap.gameNetwork.leaveGameRoom()

      dispatch(closeRankingBoardDialog())
      dispatch(setDialogStatus(DIALOG_STATUS.IN_MAIN))
    } catch (error) {
      console.error('Error leaving the room:', error)
    }
  }

  useEffect(() => {
    ;(async () => {
      getUsersRanking()
        .then((response) => {
          if (!response) return
          const { findUsersRanking } = response
          setUsersRankingList(findUsersRanking)
        })
        .catch((error) => {
          console.error(error)
        })
    })()
  }, [])

  return (
    // <Backdrop>
    //   <Wrapper>
    //     <Content>
    //       <ChatHeader>
    //         <Title>랭킹 보드</Title>
    //         <IconButton
    //           aria-label="close dialog"
    //           className="close"
    //           onClick={() => handleClose()}
    //           size="small"
    //         >
    //           <CloseIcon />
    //         </IconButton>
    //       </ChatHeader>
    //       <ChatBox>
    //         <UserList>
    //           {usersRankingList.slice(0, 3).map((value, index) => (
    //             <User key={index}>
    //               <ListItem divider>
    //                 {/* <h1 style={{ margin: '0 30px' }}>{index + 1}</h1> */}
    //                 <img
    //                   src={`../../public/assets/game/RankingBoard/medal${index + 1}.png`}
    //                   style={{ margin: '0 30px 0 10px', width: '50px', height: '50px' }}
    //                 />
    //                 <ListItemAvatar>
    //                   <Avatar
    //                     src={`../../public/assets/character/single/${value.character}_idle_anim_19.png`}
    //                   />
    //                 </ListItemAvatar>
    //                 <Profile>
    //                   <div>
    //                     <p>Lv. {value.userLevel}</p>
    //                     <p>이름: {value.username}</p>
    //                     <p>자기소개: {value.profileMessage}</p>
    //                   </div>
    //                 </Profile>
    //               </ListItem>
    //             </User>
    //           ))}
    //           {usersRankingList.slice(3).map((value, index) => (
    //             <User key={index}>
    //               <ListItem divider>
    //                 <h4 style={{ color: 'white', margin: '0 46px 0 28px' }}>{index + 4}</h4>
    //                 <ListItemAvatar>
    //                   <Avatar
    //                     src={`../../public/assets/character/single/${value.character}_idle_anim_19.png`}
    //                   />
    //                 </ListItemAvatar>
    //                 <Profile>
    //                   <div>
    //                     <p>Lv. {value.userLevel}</p>
    //                     <p>이름: {value.username}</p>
    //                     <p>자기소개: {value.profileMessage}</p>
    //                   </div>
    //                 </Profile>
    //               </ListItem>
    //             </User>
    //           ))}
    //         </UserList>
    //       </ChatBox>
    //     </Content>
    //   </Wrapper>
    // </Backdrop>
    <Backdrop>
      <Wrapper>
        <Content style={{ width: '600px', height: '860px' }}>
          <Header>
            <HeaderTitle>랭킹 보드</HeaderTitle>
            <IconButton
              aria-label="close dialog"
              className="close"
              onClick={() => handleClose()}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Header>
          <Body>
            {usersRankingList.slice(0, 3).map((value, index) => (
              <ListItem divider key={index} style={{ padding: '16px' }}>
                <NameWrapper>
                  <img
                    src={`../../public/assets/game/RankingBoard/medal${index + 1}.png`}
                    style={{ margin: '0 30px 0 10px', width: '50px', height: '50px' }}
                  />
                  <ListItemAvatar>
                    <Avatar src={`../../public/assets/character/single/${capitalizeFirstLetter(value.character)}.png`} />
                  </ListItemAvatar>
                  <NameProfile>
                    {/* <Level>Lv. {userLevel}</Level> */}
                    {/* <Username>{value.username}</Username> */}
                    <div>
                      <p>Lv. {value.userLevel}</p>
                      <p>이름: {value.username}</p>
                      <p>자기소개: {value.profileMessage}</p>
                    </div>
                  </NameProfile>
                </NameWrapper>
              </ListItem>
            ))}
            {usersRankingList.slice(3).map((value, index) => (
              <ListItem divider key={index} style={{ padding: '16px' }}>
                <NameWrapper>
                  <h4 style={{ color: 'black', margin: '0 46px 0 28px' }}>{index + 4}</h4>
                  <ListItemAvatar>
                    <Avatar
                      src={`../../public/assets/character/single/${capitalizeFirstLetter(value.character)}.png`}
                    />
                  </ListItemAvatar>
                  <NameProfile>
                    {/* <Level>Lv. {userLevel}</Level> */}
                    {/* <Username>{value.username}</Username> */}
                    <div>
                      <p>Lv. {value.userLevel}</p>
                      <p>이름: {value.username}</p>
                      <p>자기소개: {value.profileMessage}</p>
                    </div>
                  </NameProfile>
                </NameWrapper>
              </ListItem>
            ))}
          </Body>
        </Content>
      </Wrapper>
    </Backdrop>
  )
}
