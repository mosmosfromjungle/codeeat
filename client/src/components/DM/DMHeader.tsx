import React from 'react';
import styled from 'styled-components';
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { setShowDMRoom } from '../../stores/DMStore';

export function DMHeader() {
  const dispatch = useAppDispatch();
  const friendName = useAppSelector((state) => state.dm.receiverName)
  return (
    <Wrapper>
              <Title> {friendName}님과의 채팅 </Title>
              <IconButton
                aria-label="close dialog"
                className="close"
                onClick={() => dispatch(setShowDMRoom(false))}
                size="small"
              >
                <CloseIcon />
              </IconButton>
        </Wrapper>
  );
}

const Wrapper = styled.div`
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
  left: 10px;
  font-family: Font_DungGeun;
`