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

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
  const imgpath = `/assets/character/single/${capitalizeFirstLetter(character)}_idle_anim_19.png`
  const players = useAppSelector((state) => state.room.players)
  const [otherPlayers, setOtherPlayers] = useState<IPlayer[]>();
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
    setOtherPlayers(players)
  }, [players.length])

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages, showUser])

  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

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
              {otherPlayers?.map((player, i: number) => {
                return (
              <UserList>
                <User>
                  <ListItem divider key={i}>
                    <ListItemAvatar>
                      <Avatar src={imgpath} />
                    </ListItemAvatar>

                    <Profile>
                      레벨 {userLevel}<br/><br/>
                      <strong>{player.name}</strong>
                    </Profile>
                  
                    <ProfileButton>
                      <Button>
                        친구 추가하기
                      </Button>
                      <Button onClick={() => {
                        // dispatch(setShowDMRoom(true));
                        dispatch(setShowDMList(true));
                        dispatch(setShowUser(false))
                        } }>
                        메세지 보내기
                      </Button>
                    </ProfileButton>
                  </ListItem>
                </User>
              </UserList>)
              })}
            </ChatBox>
          </Content>
        </Wrapper>
    </Backdrop>
  )
}
