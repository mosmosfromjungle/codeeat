import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'

import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import CloseIcon from '@mui/icons-material/Close'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import { PersonAddAltOutlined, MailOutlineRounded } from '@mui/icons-material'
import { Content, Header, HeaderTitle } from '../GlobalStyle'

import { IPlayer } from '../../../../types/IOfficeState'
import { insertLastDM } from '../../apicalls/DM/DM'
import { HELPER_STATUS, setHelperStatus } from '../../stores/UserStore'
import { setReceiverName, setShowDMList, setShowDMRoom, setRoomId } from '../../stores/DMStore'
import { useAppSelector, useAppDispatch } from '../../hooks'
import { checkIfFirst } from '../../apicalls/DM/DM'
import { sendFriendReq, sendRequest } from '../../apicalls/friends'

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
const NameWrapper = styled.div`
  margin-right: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
`
const NameProfile = styled.div`
  color: black;
  font-family: Font_DungGeun;
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

export default function UsersDialog() {
  const dispatch = useAppDispatch()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatMessages = useAppSelector((state) => state.chat.chatMessages)
  const focused = useAppSelector((state) => state.chat.focused)
  const username = useAppSelector((state) => state.user.username)
  const character = useAppSelector((state) => state.user.character)
  const helperStatus = useAppSelector((state) => state.user.helperStatus)
  const imgpath = `/assets/character/single/${capitalizeFirstLetter(character)}_idle_anim_19.png`
  const players = useAppSelector((state) => state.room.mainPlayers)
  const [otherPlayers, setOtherPlayers] = useState<IPlayer[]>()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
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
      dispatch(setHelperStatus(HELPER_STATUS.NONE))
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
  }, [chatMessages, helperStatus])

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
      {isModalOpen && <Modal open={isModalOpen} handleClose={closeModal} />}
      <Wrapper>
        <Content>
          <Header>
            <HeaderTitle>
              <span  style={{ color: 'green', fontSize: '24px' }}> {players.length} </span>
               명 접속중
            </HeaderTitle>
            <IconButton
              aria-label="close dialog"
              className="close"
              onClick={() => dispatch(setHelperStatus(HELPER_STATUS.NONE))}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Header>
          <Body>
            {otherPlayers?.map((player, i: number) => {
              if (player.name === username) return
              return (
                <ListItem divider key={i} style={{ padding: '16px'}}>
                  <NameWrapper>
                    <ListItemAvatar>
                      <Avatar src={imgpath} />
                      {/* <img src={imgpath} /> */}
                    </ListItemAvatar>
                    <NameProfile>
                      {/* <Level>Lv. {userLevel}</Level> */}
                      <Username>{player.name}</Username>
                    </NameProfile>
                  </NameWrapper>
                  <ProfileButton>
                    <Button onClick={() => {
                        sendFriendRequest(username, player.name)
                        openModal()
                    }}>
                      <PersonAddAltOutlined fontSize='large' />
                    </Button>
                    <Button onClick={(e) => {
                        // dispatch(setShowDMRoom(true));
                        // 준택코드
                        dispatch(setShowDMList(true))
                        dispatch(setHelperStatus(HELPER_STATUS.NONE))
                        // 재혁코드
                        e.preventDefault();
                        console.log(player?.name ?? "unknown") // 🐱
                        handleClick(player)
                      }}
                    >
                      <MailOutlineRounded fontSize='large' />
                    </Button>
                  </ProfileButton>
                </ListItem>
              )
            })}
          </Body>
        </Content>
      </Wrapper>
    </Backdrop>
  )
}
