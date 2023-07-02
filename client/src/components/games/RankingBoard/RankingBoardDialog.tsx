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

const Backdrop = styled.div`
  // position: fixed;
  // display: flex;
  // width: 1000px;
  // gap: 10px;
  // bottom: 16px;
  // right: 16px;
  // align-items: flex-end;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  gap: 10px;
`

const Wrapper = styled.div`
  // height: 100%;
  // margin-top: auto;
  position: relative;
  width: 1000px;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Content = styled.div`
  margin: 70px auto;
`

const ChatHeader = styled.div`
  position: relative;
  height: 40px;
  background: #000000a7;
  border-radius: 10px 10px 0px 0px;

  .close {
    position: absolute;
    top: 0;
    right: 0;
  }
`

const Title = styled.div`
  position: absolute;
  color: white;
  font-size: 20px;
  font-weight: bold;
  top: 10px;
  left: 150px;
  font-family: Font_DungGeun;
`

const ChatBox = styled(Box)`
  // height: 580px;
  width: 1000px;
  overflow: auto;
  background: #2c2c2c;
  border: 1px solid #00000029;
  padding: 10px 10px;
  border-radius: 0px 0px 10px 10px;

  Button {
    font-size: 17px;
    font-family: Font_DungGeun;
  }
`

const UserList = styled.div`
  display: grid;
  // grid-template-columns: repeat(3, 1fr);
  gap: 20px; // 이 값을 조절하여 원하는 간격을 설정하세요
`

const User = styled.div`
  margin: 10px 10px 10px 10px;
`

const Profile = styled.div`
  // border: 3px solid red;
  margin-left: 30px;
  // padding-left: 50px;
  color: white;
  font-size: 20px;
  font-family: Font_DungGeun;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  & > div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 100px;
  }
`

const ProfileText = styled.p`
  flex: 1;
  text-align: center;
  margin: 10px; // 이 값을 조절하여 원하는 간격을 설정하세요
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
  const imgpath = `/assets/character/single/${capitalizeFirstLetter(character)}_idle_anim_19.png`

  // Send my info to friend (client -> server)
  bootstrap.gameNetwork.sendMyInfo(username, character)

  // Friend information
  const friendname = useAppSelector((state) => state.molegame.friendName)
  const friendcharacter = useAppSelector((state) => state.molegame.friendCharacter)
  const friendimgpath = `/assets/character/single/${capitalizeFirstLetter(
    friendcharacter
  )}_idle_anim_19.png`

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
    //         {/* <ButtonGroup variant="text" aria-label="text button group">
    //           <Button>Bronze</Button>
    //           <Button>Silver</Button>
    //           <Button>Gold</Button>
    //           <Button>Platinum</Button>
    //           <Button>Ruby</Button>
    //         </ButtonGroup> */}
    //         <UserList>
    //           <User>
    //             {usersRankingList.map((value, index) => (
    //               <ListItem divider>
    //                 <h1 style={{ margin: '0 40px 0 10px' }}>{index+1}</h1>
    //                 <ListItemAvatar>
    //                   {/* <Avatar src={imgpath} /> */}
    //                   <Avatar
    //                     src={`../../public/assets/character/single/${value.character}_idle_anim_19.png`}
    //                   />
    //                 </ListItemAvatar>

    //                 <Profile>
    //                   <div>
    //                     {/* <p key={index}>랭킹: {index + 1}</p> */}
    //                     <p key={index}>Lv. {value.userLevel}</p>
    //                     <p key={index}>이름: {value.username}</p>
    //                     <p key={index}>자기소개: {value.profileMessage}</p>
    //                   </div>
    //                 </Profile>
    //               </ListItem>
    //             ))}
    //           </User>
    //         </UserList>
    //       </ChatBox>
    //     </Content>
    //   </Wrapper>
    // </Backdrop>
    <Backdrop>
      <Wrapper>
        <Content>
          <ChatHeader>
            <Title>랭킹 보드</Title>
            <IconButton
              aria-label="close dialog"
              className="close"
              onClick={() => handleClose()}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </ChatHeader>
          <ChatBox>
            <UserList>
              {usersRankingList.slice(0, 3).map((value, index) => (
                <User key={index}>
                  <ListItem divider>
                    {/* <h1 style={{ margin: '0 30px' }}>{index + 1}</h1> */}
                    <img
                      src={`../../public/assets/game/RankingBoard/medal${index + 1}.png`}
                      style={{ margin: '0 30px 0 10px', width: '50px', height: '50px' }}
                    />
                    <ListItemAvatar>
                      <Avatar
                        src={`../../public/assets/character/single/${value.character}_idle_anim_19.png`}
                      />
                    </ListItemAvatar>
                    <Profile>
                      <div>
                        <p>Lv. {value.userLevel}</p>
                        <p>이름: {value.username}</p>
                        <p>자기소개: {value.profileMessage}</p>
                      </div>
                    </Profile>
                  </ListItem>
                </User>
              ))}
              {usersRankingList.slice(3).map((value, index) => (
                <User key={index}>
                  <ListItem divider>
                    <h4 style={{ color: 'white', margin: '0 46px 0 28px' }}>{index + 4}</h4>
                    <ListItemAvatar>
                      <Avatar
                        src={`../../public/assets/character/single/${value.character}_idle_anim_19.png`}
                      />
                    </ListItemAvatar>
                    <Profile>
                      <div>
                        <p>Lv. {value.userLevel}</p>
                        <p>이름: {value.username}</p>
                        <p>자기소개: {value.profileMessage}</p>
                      </div>
                    </Profile>
                  </ListItem>
                </User>
              ))}
            </UserList>
          </ChatBox>
        </Content>
      </Wrapper>
    </Backdrop>
  )
}
