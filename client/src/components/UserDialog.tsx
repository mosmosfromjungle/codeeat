/*
  Icon: mui 라이브러리 사용 (https://mui.com/material-ui/material-icons/)
*/
import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'

import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'

import CloseIcon from '@mui/icons-material/Close'

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { IPlayer } from '../../../types/IOfficeState';
import { insertLastDM } from '../apicalls/DM/DM';

import { setShowUser } from '../stores/ChatStore'
import { setReceiverName, setShowDMList, setShowDMRoom, setRoomId } from '../stores/DMStore'
import { useAppSelector, useAppDispatch } from '../hooks'
import { checkIfFirst } from '../apicalls/DM/DM';
import { sendFriendReq, sendRequest } from '../apicalls/friends'

const Backdrop = styled.div`
  position: fixed;
  display: flex;
  gap: 10px;
  bottom: 16px;
  right: 16px;
  align-items: flex-end;
`

const Wrapper = styled.div`
  height: 100%;
  margin-top: auto;
`
const Form = styled.form``

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
  height: 580px;
  width: 360px;
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
  Button {
    width: 100%;
  }
`

const User = styled.div`
  margin: 10px 10px 10px 10px;
`

const Profile = styled.div`
  color: white;
  width: 170px;
  font-size: 20px;
  font-family: Font_DungGeun;
`

const ProfileButton = styled.div`
  Button {
    width: 120px;
    color: white;
    margin-left: 20px;
    font-size: 15px;
    font-family: Font_DungGeun;
  }
`

// Todo: change the parameter in body part
const getUser = async () => {
  const apiUrl: string = 'http://auth/user/list'
  await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => {
    if (res.ok) {
      console.log('Get user list is success.')
    }
    // Todo: need to hanle return codes - 200, 400, 409 ...
  })
}

// Todo: change the parameter in body part
const getUserDetail = async (userId: string) => {
  const apiUrl: string = 'http://auth/user/detaul/' + userId
  await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => {
    if (res.ok) {
      console.log('Get user detail is success.')
    }
    // Todo: need to hanle return codes - 200, 400, 409 ...
  })
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export default function UserDialog() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatMessages = useAppSelector((state) => state.chat.chatMessages)
  const focused = useAppSelector((state) => state.chat.focused)
  const showUser = useAppSelector((state) => state.chat.showUser)

  const username = useAppSelector((state) => state.user.username)
  const character = useAppSelector((state) => state.user.character)
  const userLevel = useAppSelector((state) => state.user.userLevel)
  const imgpath = `/assets/character/single/${capitalizeFirstLetter(character)}.png`
  const players = useAppSelector((state) => state.room.mainPlayers)
  const [otherPlayers, setOtherPlayers] = useState<IPlayer[]>()
  const dispatch = useAppDispatch()
  const [open, setOpen] = React.useState(true)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [addFriendResult, setAddFriendResult] = useState<number>(0) //0: 친구 요청 전, 1: 친구 요청 성공,  2: 이미친구
  const [message, setMessage] = useState<string>('')

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  const checkFirstChat = async (receiverName) => {
    try {
      const first = await checkIfFirst({ senderName: username, receiverName: receiverName});
      console.log('첫 디엠인지 아닌지 체크, 첫디엠이면 status:200 && undefined')
      return first?.status
    } catch(err) {
      console.error('check first chat error: ',err)
    }
  }
  

  const handleClick = async (player) => {
    // const firstChatStatus = await checkFirstChat(player.name)
    // if (firstChatStatus !== undefined && firstChatStatus == 200) {
    //   dispatch(setReceiverName(player.name))
    //   dispatch(setShowDMRoom(true))
    //   dispatch(setShowUser(false)) // 수정 가능
    // } else {
      let body = {
        senderName: username,
        receiverName: player.name,
        message: `${username} 님이 메시지를 보냈습니다`
      }
      console.log(body)
      insertLastDM(body)
      dispatch(setReceiverName(player.name))
      dispatch(setShowDMRoom(true))
      dispatch(setShowUser(false))
    // }
  }

  useEffect(() => {
    if (focused) {
      inputRef.current?.focus()
    }
  }, [focused])

  useEffect(() => {
    setOtherPlayers(players)
  }, [players.length])

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages, showUser])

  const sendFriendRequest = (requester: string, recipient: string) => {
    const body: sendRequest = {
      requester: requester,
      recipient: recipient,
    }
    sendFriendReq(body)
      .then((response) => {
        console.log(response)
        if (response.status === 201) {
          setMessage(response.message)
        }
      })
      .catch((error) => {
        setMessage(error.response.data.message)
      })
  }

  const openModal = () => {
    setTimeout(() => {
      setIsModalOpen(true)
    }, 200)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const Modal = ({ open, handleClose }: { open: any; handleClose: any }) => {
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
        <h2>{message}</h2>
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

  return (
    <Backdrop>
      <Wrapper>
        <Content>
          <ChatHeader>
            <Title>{players.length} 명 접속중</Title>
            <IconButton
              aria-label="close dialog"
              className="close"
              onClick={() => dispatch(setShowUser(false))}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </ChatHeader>
          <ChatBox>
            {/* <ButtonGroup variant="text" aria-label="text button group">
              <Button>Bronze</Button>
              <Button>Silver</Button>
              <Button>Gold</Button>
              <Button>Platinum</Button>
              <Button>Ruby</Button>
            </ButtonGroup> */}
            {/* <Form onSubmit={handleSubmit}> */}
            {otherPlayers?.map((player, i: number) => {
              if (player.name === username) return
              return (
                <UserList>
                  <User>
                    <ListItem divider key={i}>
                      <ListItemAvatar>
                        <Avatar src={imgpath} />
                        {/* <Avatar
                          src={`../../public/assets/character/single/${player.character}_idle_anim_19.png`}
                        /> */}
                      </ListItemAvatar>

                      <Profile>
                        <span style={{ fontSize: '16px' }}>Lv. {userLevel}</span>
                        <br />
                        <br />
                        <strong>{player.name}</strong>
                      </Profile>

                      <ProfileButton>
                        <Button
                          onClick={() => {
                            sendFriendRequest(username, player.name)
                            openModal()
                          }}
                        >
                          친구추가
                        </Button>
                        {isModalOpen && <Modal open={isModalOpen} handleClose={closeModal} />}
                        <Button
                          onClick={(e) => {
                            // dispatch(setShowDMRoom(true));
                            // 준택코드
                            dispatch(setShowDMList(true))
                            dispatch(setShowUser(false))

                            // 재혁코드
                            e.preventDefault();
                            console.log(player?.userid ?? "unknown") // 🐱
                            handleClick(player)
                          }}
                        >
                          메세지
                        </Button>
                      </ProfileButton>
                    </ListItem>
                  </User>
                </UserList>
              )
            })}
            {/* </Form> */}
          </ChatBox>
        </Content>
      </Wrapper>
    </Backdrop>
  )
}
