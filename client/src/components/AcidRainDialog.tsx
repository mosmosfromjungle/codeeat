import React from 'react'
import styled from 'styled-components'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

import { useAppSelector, useAppDispatch } from '../hooks'
import { closeAcidRainDialog } from '../stores/AcidRainStore'
import { TypingGame } from './typinggame'
// 원래 패딩 : 16px, 180px, 16px, 10px
const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  padding: 16px 180px 16px 10px; 
  width: 100%;
  height: 100%;
`
const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: #222639;
  border-radius: 16px;
  padding: 16px;
  color: #eee;
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: max-content;

  .close {
    position: absolute;
    top: 0px;
    right: 0px;
  }
`

const AcidRainWrapper = styled.div`
  flex: 1;
  border-radius: 25px;
  overflow: hidden;
  margin-right: 25px;

  iframe {
    width: 100%;
    height: 100%;
    background: #fff;
  }
`

export default function AcidRainDialog() {
  const acidrainUrl = useAppSelector((state) => state.acidrain.acidrainUrl)
  const dispatch = useAppDispatch()

  return (
    <Backdrop>
      <Wrapper>
        <TypingGame />
        { <IconButton
          aria-label="close dialog"
          className="close"
          onClick={() => dispatch(closeAcidRainDialog())}
        >
          <CloseIcon />
        </IconButton>
        /*
        {acidrainUrl && (
          <AcidRainWrapper>
            <iframe title="white board" src={acidrainUrl} />
          </AcidRainWrapper>
        )} */}
      </Wrapper>
    </Backdrop>
  )
}
