import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'

import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import CloseIcon from '@mui/icons-material/Close'
import Divider from '@mui/material/Divider'
import { Content, Header, HeaderTitle } from '../GlobalStyle'

import { HELPER_STATUS, setHelperStatus } from '../../stores/UserStore'
import { useAppSelector, useAppDispatch } from '../../hooks'

import Button from '@mui/material/Button'

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
  padding: 10px 20px 0 20px;
  display: flex;
  flex-direction: column;
`

const VersionInfo = styled.div`
  width: 100%;
  color: black;
  font-size: 20px;
  font-family: Font_DungGeun;
`

const InfoTitle = styled.div`
  color: black;
  font-weight: bold;
  font-family: Font_DungGeun;
  text-align: center;
  margin: 16px;
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
            <Header>
              <HeaderTitle style={{ backgroundColor: 'lightblue' }}>프로그램 소개</HeaderTitle>
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
              <VersionInfo>
                <InfoTitle>코드잇 소개</InfoTitle>
                키즈들의 코딩 공간,<br/>
                여기는 코드잇(Code Eat)입니다!<br/><br/>
                한국 코딩 교육은 나날이 빨라지고 있습니다. 친구들이 코딩과 친해졌으면 좋겠어요.<br/>
                재밌는 게임을 통해 코딩과 가까워지기!<br/><br/>

                {/* <Divider/> */}

                <InfoTitle>만든 친구들 소개</InfoTitle>
                <Person>
                  배준수 [ BE ]<Button href="https://github.com/junsoopooh" target="_blank"><GitButton>GIT</GitButton></Button><br/>
                  조재혁 [ BE ]<Button href="https://github.com/whwogur" target="_blank"><GitButton>GIT</GitButton></Button><br/>
                  김초혜 [ BE ]<Button href="https://github.com/chohk10" target="_blank"><GitButton>GIT</GitButton></Button><br/>
                  서준택 [ FE ]<Button href="https://github.com/Taek222" target="_blank"><GitButton>GIT</GitButton></Button><br/>
                  서지원 [ FE ]<Button href="https://github.com/unauthorized-401" target="_blank"><GitButton>GIT</GitButton></Button><br/>
                </Person>
              </VersionInfo>
            </Body>
          </Content>
        </Wrapper>
    </Backdrop>
  )
}
