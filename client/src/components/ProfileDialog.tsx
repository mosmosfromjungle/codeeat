import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { Content, Header, HeaderTitle } from './GlobalStyle'

import { useAppSelector, useAppDispatch } from '../hooks'
import { setShowProfile } from '../stores/UserStore'
import { getMyProfile } from '../apicalls/auth'
import { UpdateRequest, updateMyProfile } from '../apicalls/auth'

import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'

const Backdrop = styled.div`
  position: fixed;
  display: flex;
  gap: 10px;
  bottom: 32px;
  left: 16px;
  align-items: flex-end;
`
const Wrapper = styled.div`
  height: 100%;
  margin-top: auto;
`
const Body = styled.div`
  flex: 1;
  height: calc(100% - 60px);
  overflow: auto;
  padding: 10px 32px 32px 32px;
  display: flex;
  flex-direction: column;
  
  .listitem {
    padding: 20px;
    flex: 0 0 auto;
    margin-bottom: 20px;
  }
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
  font-size: 28px;
  line-height: 1;
  margin: 4px 0 0 0;
`
const Form = styled.form`
`
const Table = styled.div`
`
const TextDiv = styled.div`
  // margin-bottom: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
`
const Profile = styled.div`
  color: black;
  font-family: Font_DungGeun;
  padding: 0 16px;
`
const ProfileItem = styled.div`
  margin: 16px 0;
`
const ProfileTitle = styled.div`
  font-size: 20px;
  margin: 20px 0 0 0;
  background-color: #c5e4d7;
`
const ProfileContent = styled.div`
  height: 37.6px;
  font-size: 22px;
  margin: 8px 0 0 0;
  overflow: auto;
`
const ProfileMessage = styled.div`
  height: 100px;
  font-size: 20px;
  margin: 8px 0 0 0;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
  overflow: auto;
`
const InputField = styled.input`
  width: 100%;
  font-size: 22px;
  margin: 8px 0 0 0;
  padding: 4px 8px;
`
const MessageInputField = styled.input`
  width: 100%;
  height: 100px;
  font-size: 22px;
  margin: 8px 0 0 0;
  padding: 4px 8px;
  // white-space: pre-wrap;
  // overflow-wrap: break-word;
  // word-wrap: break-word;
  // word-break: break-word;
  // hyphens: auto;
  // overflow: auto;
`
const Buttons = styled.div`
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
  
  button {
    font-size: 20px;
    font-family: Font_DungGeun; 
  }
`

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function ProfileDialog() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatMessages = useAppSelector((state) => state.chat.chatMessages)
  const focused = useAppSelector((state) => state.chat.focused)
  const showProfile = useAppSelector((state) => state.user.showProfile)
  const username = useAppSelector((state) => state.user.username)
  const character = useAppSelector((state) => state.user.character)
  const userLevel = useAppSelector((state) => state.user.userLevel)
  const imgpath = `/assets/character/single/${capitalizeFirstLetter(character)}.png`

  const dispatch = useAppDispatch()

  const [isOpen, setIsOpen] = useState(false)
  const [grade, setGrade] = useState<string>('')
  const [school, setSchool] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [gradeFieldEmpty, setGradeFieldEmpty] = useState<boolean>(false)
  const [schoolFieldWrongFormat, setSchoolFieldEmpty] = useState<boolean>(false)
  const [messageFieldEmpty, setmessageFieldEmpty] = useState<boolean>(false)

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
  }, [chatMessages, showProfile])

  useEffect(() => {
    (async () => {
      getMyProfile()
        .then((response) => {
          if (!response) return;
          const { grade, school, profileMessage } = response
          setGrade(grade)
          setSchool(school)
          setMessage(profileMessage)
        })
        .catch((error) => {
          console.error(error);
        });
    })();
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // reset the error message
    setGradeFieldEmpty(false)
    setSchoolFieldEmpty(false)
    setmessageFieldEmpty(false)

    event.preventDefault()

    if (grade === '') {
      setGradeFieldEmpty(true)
    } else if (school === '') {
      setSchoolFieldEmpty(true)
    } else if (message === '') {
      setmessageFieldEmpty(true)
    } else {
      const body: UpdateRequest = {
        grade: grade,
        school: school,
        profileMessage: message,
      }
      updateMyProfile(body)
        .then((response) => {
          if (response.status === 200) {
            const { grade, school, profileMessage } = response.payload
            setGrade(grade)
            setSchool(school)
            setMessage(profileMessage)
            console.log('성공')
            setIsOpen(false)
          }
        })
        .catch((error) => {
          if (error.response) {
            const { status, message } = error.response.data
            console.log(message)
          }
        })
    }
    const game = phaserGame.scene.keys.game as Game
    game.enableKeys()
  }

  return (
    <Backdrop>
      <Wrapper>
        <Content>
          <Header>
            <HeaderTitle style={{ backgroundColor: 'lightgreen' }}>내 프로필</HeaderTitle>
            <IconButton
              aria-label="close dialog"
              className="close"
              onClick={() => dispatch(setShowProfile(false))}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Header>
          <Body>
            <List>
              <ListItem>
                <ListItemAvatar>
                  {/* <Avatar src={imgpath} /> */}
                  <img src={imgpath} style={{ width: '40px', height: '70px', objectFit: 'cover'}} />
                </ListItemAvatar>
                <NameProfile>
                  <Level>Lv. {userLevel}</Level>
                  <Username>{username}</Username>
                </NameProfile>
              </ListItem>
            </List>
            {isOpen ? (
              <Form onSubmit={handleSubmit}>
                <TextDiv>
                  <Profile>
                    <ProfileItem>
                      <ProfileTitle>학년</ProfileTitle>
                      <InputField
                        defaultValue=""
                        onChange={(e) => setGrade(e.target.value)}
                      />
                    </ProfileItem>
                    <ProfileItem>
                      <ProfileTitle>학교</ProfileTitle>
                      <InputField
                        defaultValue=""
                        onChange={(e) => setSchool(e.target.value)}
                      />
                    </ProfileItem>
                    <ProfileItem>
                      <ProfileTitle>자기소개</ProfileTitle>
                      <MessageInputField
                        defaultValue=""
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </ProfileItem>
                  </Profile>
                </TextDiv>
                <Buttons>
                  <Button type="submit">수정완료</Button>
                </Buttons>
              </Form>
            ) : (
              <Table>
                <TextDiv>
                  <Profile>
                    <ProfileItem>
                      <ProfileTitle>학년</ProfileTitle>
                      <ProfileContent>{grade}</ProfileContent>
                    </ProfileItem>
                    <ProfileItem>
                      <ProfileTitle>학교</ProfileTitle>
                      <ProfileContent>{school}</ProfileContent>
                    </ProfileItem>
                    <ProfileItem>
                      <ProfileTitle>자기소개</ProfileTitle>
                      <ProfileMessage>{message}</ProfileMessage>
                    </ProfileItem>
                  </Profile>
                </TextDiv>
                <Buttons>
                  <Button onClick={() => {
                    const game = phaserGame.scene.keys.game as Game
                    game.disableKeys()
                    setIsOpen(true)
                  }}>
                    수정하기
                  </Button>
                </Buttons>
              </Table>
            )}
          </Body>
        </Content>
      </Wrapper>
    </Backdrop>
  )
}
