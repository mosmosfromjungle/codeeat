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

import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

import { setShowDMList, setShowDMRoom } from '../stores/DMStore'
import { setShowUser, setShowFriend } from '../stores/ChatStore'
import { useAppSelector, useAppDispatch } from '../hooks'
import {
  getFriendList,
  getFriendRequestList,
  handleAccept,
  handleReject,
  handleRemove,
  AcceptRequest,
  RejectRequest,
  RemoveRequest,
} from '../apicalls/friends'
import { IFriends } from '../../../server/controllers/FriendsControllers/types'
import axios from 'axios'

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
    // margin-left: 20px;
    font-size: 15px;
    font-family: Font_DungGeun;
  }
`

export default function FriendDialog() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatMessages = useAppSelector((state) => state.chat.chatMessages)
  const focused = useAppSelector((state) => state.chat.focused)
  // const showUser = useAppSelector((state) => state.chat.showUser)
  const showFriend = useAppSelector((state) => state.chat.showFriend)

  const username = useAppSelector((state) => state.user.username)
  const character = useAppSelector((state) => state.user.character)
  const userLevel = useAppSelector((state) => state.user.userLevel)
  const imgpath = `../../public/assets/character/single/${character}_idle_anim_19.png`

  const dispatch = useAppDispatch()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (focused) {
      inputRef.current?.focus()
    }
  }, [focused])

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages, showFriend])

  const [open, setOpen] = React.useState(true)
  const [friendList, setFriendList] = useState<IFriends[]>([])
  const [friendRequestList, setFriendRequestList] = useState<IFriends[]>([])
  // const [requesterId, setRequesterId] = useState<string>('')
  // const [recipientId, setRecipientId] = useState<string>('')
  const [isOpen, isSetOpen] = useState(false)


  // useEffect(() => {
  //   console.log(friendList)
  // }, [friendList])

  useEffect(() => {
    ;(async () => {
      getFriendList()
        .then((response) => {
          if (!response) return
          const { friends } = response
          // console.log(friends)

          // for (let i = 0; i < friends.length; i++) {
          //   console.log(friends[i].recipientId)
          // }

          setFriendList(friends)
        })
        .catch((error) => {
          console.error(error)
        })
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      getFriendRequestList()
        .then((response) => {
          if (!response) return
          // console.log('dhkTsi???')
          const { receivedRequests, sentRequests } = response
          // console.log(sentRequests)
          // console.log(receivedRequests)

          setFriendRequestList(receivedRequests)
        })
        .catch((error) => {
          console.error(error)
        })
    })()
  }, [])

  const handleClose = () => {
    isSetOpen(false)
  }

  // 요청 목록 리스트에 쌓인 requesterId, recipientId를 handleAccept에 body로 넘겨주면 알아서 api uri 호출 후 처리해 주지 않을까? 처리해서 받아온 거를 setRequesterId로 넣어주면 될듯? 그럼 일단 get으로 요청 목록 리스트를 가져와야겠네.
  // recipientId: string, requesterId: string
  const receiveAccept = (value) => {
    const body: AcceptRequest = {
      requester: value.requesterId,
      recipient: value.recipientId,
    }
    handleAccept(body)
      // .then((response) => {
      //   if (response.status === 200) {
      //     const { requesterId, recipientId } = response.payload
      //     setRequesterId(requesterId)
      //     setRecipientId(recipientId)
      //     console.log('handleAccept 성공')
      //     dispatch(setShowFriend(false))
      //   }
      // })
      .then((response) => {
        if (!response) return
        console.log(response)
        dispatch(setShowFriend(false))
      })
      .catch((error) => {
        if (error.response) {
          const { status, message } = error.response.data
          // setAddFriendResult(2)
          console.log('message: ' + message)
        }
      })
  }

  const receiveReject = (value) => {
    const body: RejectRequest = {
      requester: value.requesterId,
      recipient: value.recipientId,
    }
    handleReject(body)
      // .then((response) => {
      //   console.log(response)
      //   if (response.status === 200) {
      //     const { requesterId, recipientId } = response.payload
      //     setRequesterId(requesterId)
      //     setRecipientId(recipientId)
      //     console.log('handleReject 성공')
      //     dispatch(setShowFriend(false))
      //   }
      // })
      .then((response) => {
        if (!response) return
        // console.log(response)
        dispatch(setShowFriend(false))
      })
      .catch((error) => {
        if (error.response) {
          const { status, message } = error.response.data
          console.log('message: ' + message)
        }
      })
  }

  const removeFriendList = (value) => {
    const body: RemoveRequest = {
      requester: value.requesterId,
      recipient: value.recipientId,
    }
    handleRemove(body)
      // .then((response) => {
      //   if (response.status === 200) {
      //     const { requesterId, recipientId } = response.payload
      //     setRequesterId(requesterId)
      //     setRecipientId(recipientId)
      //     dispatch(setShowFriend(false))
      //   }
      // })
      .then((response) => {
        if (!response) return
        // console.log(response)
        dispatch(setShowFriend(false))
      })
      .catch((error) => {
        if (error.response) {
          const { status, message } = error.response.data
          // setAddFriendResult(2)
          console.log('message: ' + message)
        }
      })
  }

  return (
    <Backdrop>
      <Wrapper>
        <Content>
          <ChatHeader>
            <Title>친구들</Title>
            <IconButton
              aria-label="close dialog"
              className="close"
              onClick={() => dispatch(setShowFriend(false))}
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

            <UserList>
              <User>
                {friendList.map((value, index) => (
                  <ListItem divider>
                    <ListItemAvatar>
                      {/* <Avatar src={imgpath} /> */}
                      <Avatar
                        src={`../../public/assets/character/single/${value.character}_idle_anim_19.png`}
                      />
                    </ListItemAvatar>

                    <Profile>
                      <div>
                        <p key={index}>{value.requesterId}</p>
                      </div>
                    </Profile>

                    <ProfileButton>
                      <Button
                        onClick={() => {
                          // dispatch(setShowDMRoom(true));
                          dispatch(setShowDMList(true))
                          dispatch(setShowUser(false))
                        }}
                      >
                        메세지 보내기
                      </Button>
                      <Button onClick={() => removeFriendList(value)}>우리 그만하자</Button>
                    </ProfileButton>
                  </ListItem>
                ))}
              </User>
            </UserList>
            <hr></hr>
            <UserList>
              <User>
                {friendRequestList.map((value, index) => (
                  <ListItem divider>
                    <ListItemAvatar>
                      {/* <Avatar src={imgpath} /> */}
                      <Avatar
                        src={`../../public/assets/character/single/${value.character}_idle_anim_19.png`}
                      />
                    </ListItemAvatar>

                    <Profile>
                      <div>
                        <p key={index}>{value.requesterId}</p>
                      </div>
                    </Profile>

                    <ProfileButton>
                      {/* <Button>메세지 보내기</Button> */}
                      <Button onClick={() => receiveReject(value)} color="primary">
                        친구 싫어
                      </Button>
                      <Button onClick={() => receiveAccept(value)} color="primary">
                        친구 좋아
                      </Button>
                    </ProfileButton>
                  </ListItem>
                ))}
              </User>
            </UserList>
          </ChatBox>
        </Content>
      </Wrapper>
    </Backdrop>
  )
}
