import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'

import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'

import CloseIcon from '@mui/icons-material/Close'

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import { setShowProfile } from '../stores/UserStore'
import { useAppSelector, useAppDispatch } from '../hooks'
import { getMyProfile } from '../apicalls/auth';
import { UpdateRequest, updateMyProfile } from '../apicalls/auth';

import Button from '@mui/material/Button'
import axios from 'axios'

const Backdrop = styled.div`
  position: fixed;
  display: flex;
  gap: 10px;
  bottom: 40px;
  left: 16px;
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
  left: 95px;
  font-family: Font_DungGeun;
`

const ChatBox = styled(Box)`
  height: 370px;
  width: 250px;
  overflow: auto;
  background: #2c2c2c;
  border: 1px solid #00000029;
  padding: 10px 30px;
  border-radius: 0px 0px 10px 10px;
`

const TextDiv = styled.div`
  margin-bottom: 10px;
`

const Buttons = styled.div`
  button {
    left: 30px;
    margin: 10px 10px 10px 10px;
    font-size: 20px;
    font-family: Font_DungGeun;
  }
`

const Profile = styled.div`
  color: white;
  font-size: 20px;
  font-family: Font_DungGeun;
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
  const imgpath = `/assets/character/single/${capitalizeFirstLetter(character)}_idle_anim_19.png`

  const dispatch = useAppDispatch()

  const [grade, setGrade] = useState<string>('') // git
  const [school, setSchool] = useState<string>('') // email
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
          const { contactGit, contactEmail, profileMessage } = response
          setGrade(contactGit)
          setSchool(contactEmail)
          setMessage(profileMessage)
        })
        .catch((error) => {
          console.error(error);
        });
    })();
  }, []);

  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  const [isOpen, setIsOpen] = useState(false)

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
        username: username,
        character: character,
        contactGit: grade,
        contactEmail: school,
        profileMessage: message,
      }
      updateMyProfile(body)
        .then((response) => {
          if (response.status === 200) {
            const { contactGit, contactEmail, profileMessage } = response.payload
            setGrade(contactGit)
            setSchool(contactEmail)
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
  }

  return (
    <Backdrop>
      <Wrapper>
        <Content>
          <ChatHeader>
            <Title>내소개</Title>
            <IconButton
              aria-label="close dialog"
              className="close"
              onClick={() => dispatch(setShowProfile(false))}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </ChatHeader>
          <ChatBox>
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar src={imgpath} />
                </ListItemAvatar>
                <Profile>
                  레벨 {userLevel}
                  <br />
                  <br />
                  <strong>{username}</strong>님
                </Profile>
              </ListItem>
            </List>
            {isOpen ? (
              <>
                <Form onSubmit={handleSubmit}>
                  <TextDiv>
                    <TextField
                      label="학년"
                      id="standard-size-normal"
                      defaultValue=""
                      onChange={(e) => setGrade(e.target.value)}
                      variant="standard"
                    />
                    <TextField
                      label="학교"
                      id="standard-size-normal"
                      defaultValue=""
                      onChange={(e) => setSchool(e.target.value)}
                      variant="standard"
                    />
                    <TextField
                      id="standard-size-normal"
                      label="자기소개"
                      defaultValue=""
                      onChange={(e) => setMessage(e.target.value)}
                      variant="standard"
                    />
                  </TextDiv>
                  <Buttons>
                    <Button variant="contained" size="large" type="submit">
                      수정완료
                    </Button>
                  </Buttons>
                </Form>
              </>
            ) : (
              <>
                <TextDiv>
                  <Profile>
                    학년: {grade} <br></br>
                    <br />
                    학교: {school} <br></br>
                    <br />
                    자기소개: {message} <br></br>
                    <br />
                  </Profile>
                </TextDiv>
                <Buttons>
                  <Button onClick={() => setIsOpen(true)}>수정하기</Button>
                </Buttons>
              </>
            )}
          </ChatBox>
        </Content>
      </Wrapper>
    </Backdrop>
  )
}
