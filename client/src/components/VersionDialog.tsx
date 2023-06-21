import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'

import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import CloseIcon from '@mui/icons-material/Close'
import Divider from '@mui/material/Divider'

import { setShowVersion } from '../stores/UserStore'
import { useAppSelector, useAppDispatch } from '../hooks'

import Button from '@mui/material/Button'

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
  left: 80px;
  font-family: Font_DungGeun;
`

const ChatBox = styled(Box)`
  height: 420px;
  width: 300px;
  overflow: auto;
  background: #2c2c2c;
  border: 1px solid #00000029;
  padding: 10px 20px;
  border-radius: 0px 0px 10px 10px;
`

const VersionInfo = styled.div`
  width: 100%;
  color: white;
  font-size: 15px;
  font-family: Font_DungGeun;
`

const InfoTitle = styled.div`
  color: white;
  font-weight: bold;
  font-family: Font_DungGeun;
  text-align: center;
  margin: 10px;
`

const Person = styled.div`
  text-align: center;
`

const GitButton = styled.div`
  font-weight: 18px;
  font-weight: bold;
  font-family: Font_DungGeun;
`

export default function ProfileDialog() {
  const dispatch = useAppDispatch()

  return (
    <Backdrop>
        <Wrapper>
          <Content>
            <ChatHeader>
              <Title>
                프로그램 소개
              </Title>
              <IconButton
                aria-label="close dialog"
                className="close"
                onClick={() => dispatch(setShowVersion(false))}
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </ChatHeader>
            <ChatBox>
              <VersionInfo>
                <InfoTitle>코드잇 소개</InfoTitle>
                키즈들의 코딩 공간,<br/>
                여기는 코드잇(Code Eat)입니다!<br/><br/>
                한국 코딩 교육은 나날이 빨라지고 있습니다. 친구들이 코딩과 친해졌으면 좋겠어요.<br/>
                재밌는 게임을 통해 코딩과 가까워지기!<br/><br/>

                <Divider/>

                <InfoTitle>만든 친구들 소개</InfoTitle>
                <Person>
                  김초혜 | BE | <Button href="https://github.com/chohk10" target="_blank"><GitButton>GIT</GitButton></Button><br/>
                  배준수 | BE | <Button href="https://github.com/junsoopooh" target="_blank"><GitButton>GIT</GitButton></Button><br/>
                  서준택 | BE | <Button href="https://github.com/Taek222" target="_blank"><GitButton>GIT</GitButton></Button><br/>
                  서지원 | FE | <Button href="https://github.com/unauthorized-401" target="_blank"><GitButton>GIT</GitButton></Button><br/>
                  조재혁 | FE | <Button href="https://github.com/whwogur" target="_blank"><GitButton>GIT</GitButton></Button>
                </Person>
              </VersionInfo>
            </ChatBox>
          </Content>
        </Wrapper>
    </Backdrop>
  )
}
