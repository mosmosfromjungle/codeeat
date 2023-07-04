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
import { getRoomId } from '../../apicalls/DM/DM'
import { HELPER_STATUS, setHelperStatus } from '../../stores/UserStore'
import { setReceiverName, setShowDMList, setShowDMRoom, setRoomId } from '../../stores/DMStore'
import { useAppSelector, useAppDispatch } from '../../hooks'
import { checkIfFirst } from '../../apicalls/DM/DM'
import { getUserProfile } from '../../apicalls/auth'
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
  const [friendUsername, setFriendUsername] = useState<string>('')
  const [friendCharacter, setFriendCharacter] = useState<string>('')
  const [friendUserLevel, setFriendUserLevel] = useState<string>('')
  const [grade, setGrade] = useState<string>('')
  const [school, setSchool] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false)
  const [isResModalOpen, setIsResModalOpen] = useState<boolean>(false)
  const [resMessage, setResMessage] = useState<string>('')

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  const getRoooom = async (username, playerName) => {
    getRoomId({myName : username, targetName: playerName})
    .then((roomId) => {
      if (roomId !== null) {
        dispatch(setRoomId(roomId))
      } else {
        dispatch(setRoomId('first'))
      }
    })
    
  }
  const handleClick = (player) => {
    getRoooom(username,player.name)
    dispatch(setReceiverName(player.name))
    dispatch(setShowDMRoom(true))
    dispatch(setHelperStatus(HELPER_STATUS.NONE))
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
          setResMessage(response.message)
        }
      })
      .catch((error) => {
        setResMessage(error.response.data.message)
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
              src={`../../public/assets/character/single/${friendCharacter}_idle_anim_19.png`}
              alt=""
            />
            <div>
              <h2>Lv: {friendUserLevel}</h2>
              <h2>{friendUsername}</h2>
            </div>
          </div>
          <>
            <TextDiv>
              <Profile>
                학년: {grade} <br /><br />
                학교: {school} <br /><br />
                자기소개: {message} <br /><br />
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
                  <Button onClick={() => {
                    getFriendProfile(player.name)
                    openProfileModal()
                  }}>
                  <NameWrapper>
                    <ListItemAvatar>
                      <Avatar src={imgpath} />
                      {/* <img src={imgpath} /> */}
                    </ListItemAvatar>
                    <NameProfile>
                      <Username>{player.name}</Username>
                    </NameProfile>
                  </NameWrapper>
                  </Button>
                  <ProfileButton>
                    <Button onClick={() => {
                        sendFriendRequest(username, player.name)
                        openResModal()
                    }}>
                      <PersonAddAltOutlined fontSize='large' />
                    </Button>
                    <Button onClick={(e) => {
                        e.preventDefault();
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
