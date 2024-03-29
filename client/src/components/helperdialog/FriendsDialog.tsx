import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import CloseIcon from '@mui/icons-material/Close'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import { PersonRemoveOutlined, MailOutlineRounded } from '@mui/icons-material'
import { Content, Header, HeaderTitle } from '../GlobalStyle'

import { setShowDMList, setShowDMRoom } from '../../stores/DMStore'
import { HELPER_STATUS, setHelperStatus } from '../../stores/UserStore'
import { useAppSelector, useAppDispatch } from '../../hooks'
import { getUserProfile } from '../../apicalls/auth'
import {
  getFriendList,
  getFriendRequestList,
  handleAccept,
  handleReject,
  handleRemove,
  AcceptRequest,
  RejectRequest,
  RemoveRequest,
} from '../../apicalls/friends'

interface friendInterface {
  username: string
  character: string
}

const Backdrop = styled.div`
  position: fixed;
  display: flex;
  gap: 10px;
  bottom: 24px;
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
    font-size: 16px;
    font-weight: bold;
    font-family: Font_DungGeun;
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

export default function FriendsDialog() {
  const dispatch = useAppDispatch()
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatMessages = useAppSelector((state) => state.chat.chatMessages)
  const focused = useAppSelector((state) => state.chat.focused)
  const username = useAppSelector((state) => state.user.username)
  const helperStatus = useAppSelector((state) => state.user.helperStatus)
  const [friendList, setFriendList] = useState<friendInterface[]>([])
  const [friendRequestList, setFriendRequestList] = useState<friendInterface[]>([])
  const [friendUsername, setFriendUsername] = useState<string>('')
  const [friendCharacter, setFriendCharacter] = useState<string>('')
  const [friendUserLevel, setFriendUserLevel] = useState<number>('')
  const [grade, setGrade] = useState<string>('')
  const [school, setSchool] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false)
  const [isResModalOpen, setIsResModalOpen] = useState<boolean>(false)
  const [resMessage, setResMessage] = useState<string>('')

  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  // }

  useEffect(() => {
    if (focused) {
      inputRef.current?.focus()
    }
  }, [focused])

  // useEffect(() => {
  //   scrollToBottom()
  // }, [chatMessages, helperStatus])

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
  }, [isResModalOpen])

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
  }, [isResModalOpen])

  const receiveAccept = (requester: string, recipient: string) => {
    const body: AcceptRequest = {
      requester: requester,
      recipient: recipient,
    }
    handleAccept(body)
      .then((response) => {
        if (!response) return
        setResMessage('친구 요청을 수락했어요')
      })
      .catch((error) => {
        setResMessage('친구요청을 수락하는데 오류가 있었어요!')
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
        setResMessage('친구 요청을 거절했어요')
      })
      .catch((error) => {
        setResMessage('친구요청을 거절하는데 오류가 있었어요!')
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
        setResMessage('친구를 삭제했어요')
      })
      .catch((error) => {
        setResMessage('친구를 삭제하는데 오류가 있었어요!')
      })
  }

  const getFriendProfile = (username: string) => {
    getUserProfile(username)
      .then((response) => {
        if (!response) return
        const { username, character, userLevel, grade, school, profileMessage } = response
        setFriendUsername(username)
        setFriendCharacter(character)
        setFriendUserLevel(userLevel)
        setGrade(grade)
        setSchool(school)
        setMessage(profileMessage)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const openResModal = () => {
    setTimeout(() => {
      setIsResModalOpen(true)
    }, 200)
  }

  const closeResModal = () => {
    setIsResModalOpen(false)
  }

  const openProfileModal = () => {
    setTimeout(() => {
      setIsProfileModalOpen(true)
    }, 200)
  }

  const closeProfileModal = () => {
    setIsProfileModalOpen(false)
  }

  const ResModal = ({ open, handleClose }: { open: any; handleClose: any }) => {
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
        <h2>{resMessage}</h2>
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

  const ProfileModal = ({ open, handleClose }: { open: any; handleClose: any }) => {
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
            <img
              src={`../../public/assets/character/single/${capitalizeFirstLetter(friendCharacter)}.png`}
              style={{ width: '40x', height: '70px', objectFit: 'cover' }}
            />
            <div>
              <h2>Lv: {friendUserLevel}</h2>
              <h2>{friendUsername}</h2>
            </div>
          </div>
          <>
            <TextDiv>
              <Profile>
                학년: {grade} <br />
                <br />
                학교: {school} <br />
                <br />
                자기소개: {message} <br />
                <br />
              </Profile>
            </TextDiv>
          </>
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

  return (
    <Backdrop>
      {isResModalOpen && <ResModal open={isResModalOpen} handleClose={closeResModal} />}
      {isProfileModalOpen && <ProfileModal open={isProfileModalOpen} handleClose={closeProfileModal} />}
      <Wrapper>
        <Content>
          <Header>
            <HeaderTitle>친구들</HeaderTitle>
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
            {friendRequestList.length > 0 && (
              <ListTitle>!! 친구 요청 !!</ListTitle>
            )}
            {friendRequestList.map((value, index) => (
              <ListItem divider key={index} style={{ padding: '16px'}}>
                <Button onClick={() => {
                  getFriendProfile(value.username)
                  openProfileModal()
                }}>
                <NameWrapper>
                  <ListItemAvatar>
                    <Avatar
                      src={`../../public/assets/character/single/${capitalizeFirstLetter(value.character)}.png`}
                    />
                  </ListItemAvatar>
                  <NameProfile>
                    {/* <Level>Lv. {userLevel}</Level> */}
                    <Username>{value.username}</Username>
                  </NameProfile>
                </NameWrapper>
                </Button>
                <ProfileButton>
                  <Button
                    onClick={() => {
                      receiveReject(value.username, username)
                      openResModal()
                    }}
                    color="primary"
                  >
                    싫어
                  </Button>
                  <Button
                    onClick={() => {
                      receiveAccept(value.username, username)
                      openResModal()
                    }}
                    color="primary"
                  >
                    좋아
                  </Button>
                </ProfileButton>
              </ListItem>
            ))}
            {friendList.length > 0 && (
              <ListTitle>내 친구들</ListTitle>
            )}
            {friendList.map((value, index) => (
              <ListItem divider key={index} style={{ padding: '16px'}}>
                <Button onClick={() => {
                  getFriendProfile(value.username)
                  openProfileModal()
                }}>
                <NameWrapper>
                  <ListItemAvatar>
                    <Avatar
                      src={`../../public/assets/character/single/${capitalizeFirstLetter(value.character)}.png`}
                    />
                  </ListItemAvatar>
                  <NameProfile>
                    {/* <Level>Lv. {userLevel}</Level> */}
                    <Username>{value.username}</Username>
                  </NameProfile>
                </NameWrapper>
                </Button>
                <ProfileButton>
                  <Button onClick={() => {
                    removeFriendList(value.username, username)
                    openResModal()
                  }}>
                    <PersonRemoveOutlined fontSize='large' style={{ color: 'gray'}} />
                  </Button>
                  <Button
                    onClick={() => {
                      // dispatch(setShowDMRoom(true));
                      dispatch(setShowDMList(true))
                      dispatch(setHelperStatus(HELPER_STATUS.NONE))
                    }}
                  >
                    <MailOutlineRounded fontSize='large' />
                  </Button>
                </ProfileButton>
              </ListItem>
            ))}
          </Body>
        </Content>
      </Wrapper>
    </Backdrop>
  )
}
