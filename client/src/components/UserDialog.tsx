/*
  Icon: mui 라이브러리 사용 (https://mui.com/material-ui/material-icons/)
*/
import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'

import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import CloseIcon from '@mui/icons-material/Close'

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { IPlayer } from '../../../types/IOfficeState';

import { setShowUser } from '../stores/ChatStore'
import { setShowDMList, setShowDMRoom } from '../stores/DMStore'
import { useAppSelector, useAppDispatch } from '../hooks'
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
  width: 120px;
  font-size: 20px;
  font-family: Font_DungGeun;
`

const ProfileButton = styled.div`
  Button {
    width: 150px;
    color: white;
    margin-left: 20px;
    font-size: 15px;
    font-family: Font_DungGeun;
  }
`

// Todo: change the parameter in body part
const getUser = async() => {
  const apiUrl: string = 'http://auth/user/list';
  await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
  }).then(res => {
    if (res.ok) {
      console.log("Get user list is success.");
    }
    // Todo: need to hanle return codes - 200, 400, 409 ...
  })
};

// Todo: change the parameter in body part
const getUserDetail = async(userId: string) => {
  const apiUrl: string = 'http://auth/user/detaul/' + userId;
  await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
  }).then(res => {
    if (res.ok) {
      console.log("Get user detail is success.");
    }
    // Todo: need to hanle return codes - 200, 400, 409 ...
  })
};

export default function UserDialog() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatMessages = useAppSelector((state) => state.chat.chatMessages)
  const focused = useAppSelector((state) => state.chat.focused)
  const showUser = useAppSelector((state) => state.chat.showUser)

  const username = useAppSelector((state) => state.user.username)
  const character = useAppSelector((state) => state.user.character)
  const userLevel = useAppSelector((state) => state.user.userLevel)
  const imgpath = `../../public/assets/character/single/${character}_idle_anim_19.png`
  const players = useAppSelector((state) => state.room.players)
  const [otherPlayers, setOtherPlayers] = useState<IPlayer[]>()
  const dispatch = useAppDispatch()

  const [requester, setRequester] = useState<string>('')
  const [recipient, setRecipient] = useState<string>('')
  const [requesterId, setRequesterId] = useState<string>('')
  const [recipientId, setRecipientId] = useState<string>('')
  const [gradeFieldEmpty, setGradeFieldEmpty] = useState<boolean>(false)
  const [schoolFieldWrongFormat, setSchoolFieldEmpty] = useState<boolean>(false)
  const [messageFieldEmpty, setmessageFieldEmpty] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [addFriendResult, setAddFriendResult] = useState<number>(0) //0: 친구 요청 전, 1: 친구 요청 성공,  2: 이미친구

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
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

  const [open, setOpen] = React.useState(true)

  const handleClick = () => {
    setOpen(!open)
  }

  const sendFriendRequest = (requester: string, recipient: string) => {
    // reset the error message
    // setGradeFieldEmpty(false)
    // setSchoolFieldEmpty(false)
    // setmessageFieldEmpty(false)

    // event.preventDefault()

    const body: sendRequest = {
      requester: requester,
      recipient: recipient,
    }
    sendFriendReq(body)
      .then((response) => {
        console.log(response.payload)
        if (response.status === 201) {
          const { requesterId, recipientId } = response.payload
          // console.log(requesterId)
          // console.log(recipientId)
          setRequesterId(requesterId)
          setRecipientId(recipientId)
          setAddFriendResult(1)
          console.log('성공')
          // setIsOpen(false)
        }
      })
      .catch((error) => {
        if (error.response) {
          const { status, message } = error.response.data
          setAddFriendResult(2)
          console.log(message)
        }
      })
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const Modal = ({ open, handleClose }) => {
    switch (addFriendResult) {
      case 1:
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
              fontSize: '20px',
              color: '#eee',
              textAlign: 'center',
              fontFamily: 'Font_DungGeun',
            }}
          >
            <h2>친구 요청 완료</h2>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleClose}
              style={{ color: 'black' }}
            >
              확인
            </Button>
            <button
              onClick={handleClose}
              style={{
                backgroundColor: '#222639',
                color: '#eee',
                fontSize: '20px',
                borderRadius: '24px',
                boxShadow: '0px, 10px, 24px, #0000006f',
              }}
            >
              확인
            </button>
          </div>
        )
      case 2:
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
              fontSize: '20px',
              color: '#eee',
              textAlign: 'center',
              fontFamily: 'Font_DungGeun',
            }}
          >
            <h2>이미 친구요청을 보낸 적이 있어요</h2>
            <Button variant="contained" color="secondary" onClick={handleClose} style={{ color: 'black' }}>
              확인
            </Button>
            {/* <button
              onClick={handleClose}
              style={{
                backgroundColor: '#222639',
                color: '#eee',
                fontSize: '20px',
                borderRadius: '24px',
                boxShadow: '0px, 10px, 24px, #0000006f',
              }}
            >
              확인
            </button> */}
          </div>
        )
    }
    // return (
    //   <Backdrop>
    //     <Wrapper>
    //       <>
    //         <Title>CodeEAT</Title>
    //         <button onClick={handleClose}>Close</button>
    //       </>
    //     </Wrapper>
    //   </Backdrop>
      // <div
      //   style={{
      //     position: 'fixed',
      //     top: '50%',
      //     left: '50%',
      //     transform: 'translate(-50%, -50%)',
      //     backgroundColor: '#fff',
      //     padding: '50px',
      //     zIndex: 1000,
      //   }}
      // >
      //   <h2>Game Over!</h2>
      //   {/* ...Your other modal contents... */}
        // <button onClick={handleClose}>Close</button>
      // </div>
      // <div id="ending" className="ending finalEnding">
      //   <p id="ending-box">
      //     <p id="ending-box-title">🎮🎮 Game Over ! 🎲🎲</p>
      //     <p>
      //       <span>Your score is &nbsp;</span>
      //       <span className="last">{total}</span>
      //     </p>
      //     <p>
      //       <span>Friend score is &nbsp;</span>
      //       <span className="last">{total}</span>
      //     </p>
      //     <p>
      //       <span>The winner is &nbsp;</span>
      //       <span className="winner">{username}</span>
      //     </p>

      //     <div className="btn-wrap">
      //       <button
      //         type="button"
      //         className="restart-btn"
      //         style={{ color: '#f9f871' }}
      //         onClick={() => hideModal()}
      //         onMouseEnter={handleMouseOver}
      //       >
      //         CLOSE
      //       </button>
      //     </div>
      //   </p>
      // </div>
    // )
  }

  const Overlay = styled.div`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    // background-color: rgba(0, 0, 0, 0.7);
    z-index: 1000;
  `

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
            <ButtonGroup variant="text" aria-label="text button group">
              <Button>Bronze</Button>
              <Button>Silver</Button>
              <Button>Gold</Button>
              <Button>Platinum</Button>
              <Button>Ruby</Button>
            </ButtonGroup>
            {/* <Form onSubmit={handleSubmit}> */}
            {otherPlayers?.map((player, i: number) => {
              return (
                <UserList>
                  <User>
                    <ListItem divider key={i}>
                      <ListItemAvatar>
                        <Avatar src={imgpath} />
                      </ListItemAvatar>

                      <Profile>
                        레벨 {userLevel}
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
                          친구 추가하기
                        </Button>
                        <Button onClick={openModal}>안녕</Button>

                        {/* Render the modal and the overlay only when isModalOpen is true */}
                        {isModalOpen && (
                          <>
                            {/* <Overlay onClick={closeModal} /> */}
                            <Modal open={isModalOpen} handleClose={closeModal} />
                          </>
                        )}
                        <Button
                          onClick={() => {
                            // dispatch(setShowDMRoom(true));
                            dispatch(setShowDMList(true))
                            dispatch(setShowUser(false))
                          }}
                        >
                          메세지 보내기
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
