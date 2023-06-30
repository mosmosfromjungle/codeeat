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
  const [isOpen, isSetOpen] = useState(false)

  useEffect(() => {
    ;(async () => {
      getFriendList()
        .then((response) => {
          if (!response) return
          const { friendsListForDisplay } = response
          setFriendList(friendsListForDisplay)
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
          const { findReceivedRequests } = response
          setFriendRequestList(findReceivedRequests)
        })
        .catch((error) => {
          console.error(error)
        })
    })()
  }, [])

  const handleClose = () => {
    isSetOpen(false)
  }

  const receiveAccept = (requester: string, recipient: string) => {
    const body: AcceptRequest = {
      requester: requester,
      recipient: recipient,
    }
    handleAccept(body)
      .then((response) => {
        if (!response) return
        dispatch(setShowFriend(false))
      })
      .catch((error) => {
        if (error.response) {
          const { status, message } = error.response.data
          console.log('message: ' + message)
        }
      })
  }

  const receiveReject = (requester: string, recipient: string) => {
    const body: RejectRequest = {
      requester: requester,
      recipient: recipient,
    }
    handleReject(body)
      .then((response) => {
        if (!response) return
        dispatch(setShowFriend(false))
      })
      .catch((error) => {
        if (error.response) {
          const { status, message } = error.response.data
          console.log('message: ' + message)
        }
      })
  }

  const removeFriendList = (requester: string, recipient: string) => {
    const body: RemoveRequest = {
      requester: requester,
      recipient: recipient,
    }
    handleRemove(body)
      .then((response) => {
        if (!response) return
        dispatch(setShowFriend(false))
      })
      .catch((error) => {
        if (error.response) {
          const { status, message } = error.response.data
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
            {/* <ButtonGroup variant="text" aria-label="text button group">
              <Button>Bronze</Button>
              <Button>Silver</Button>
              <Button>Gold</Button>
              <Button>Platinum</Button>
              <Button>Ruby</Button>
            </ButtonGroup> */}

            <UserList>
              <User>
                {friendList.length > 0 && (
                  <span style={{ color: 'white', fontFamily: 'Font_DungGeun' }}>친구 목록</span>
                )}
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
                        <p key={index}>{value.username}</p>
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
                      <Button onClick={() => removeFriendList(value.username, username)}>
                        우리 그만하자
                      </Button>
                    </ProfileButton>
                  </ListItem>
                ))}
              </User>
            </UserList>
            {/* <hr></hr> */}
            <UserList>
              <User>
                {friendRequestList.length > 0 && (
                  <span style={{ color: 'white', fontFamily: 'Font_DungGeun' }}>
                    친구 요청 목록
                  </span>
                )}
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
                        <p key={index}>{value.username}</p>
                      </div>
                    </Profile>

                    <ProfileButton>
                      {/* <Button>메세지 보내기</Button> */}
                      <Button
                        onClick={() => receiveReject(value.username, username)}
                        color="primary"
                      >
                        친구 싫어
                      </Button>
                      <Button
                        onClick={() => receiveAccept(value.username, username)}
                        color="primary"
                      >
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
