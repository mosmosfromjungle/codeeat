import Fab from '@mui/material/Fab'
import styled from 'styled-components';
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined';
import VolumeOffOutlinedIcon from '@mui/icons-material/VolumeOffOutlined';
import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks';
import { toggleMainBgm } from '../stores/AudioStore';
import { HelperButton } from './GlobalStyle';

export default function BGMController() {
  const dispatch = useAppDispatch();  
  const playingBGM = useAppSelector((state) => state.audio.MainBgm)

  const handleToggle = () => {
    dispatch(toggleMainBgm());
  }

  return (
    <Wrapper>
        <FabWrapper>
        <HelperButton 
          disableRipple
          onClick={handleToggle}>
          {playingBGM ? (
            <VolumeUpOutlinedIcon fontSize="large" sx={{ color: 'black' }} />
          ) : (
            <VolumeOffOutlinedIcon fontSize="large" sx={{ color: 'black' }} />
          )}
      </HelperButton>
      </FabWrapper>
    </Wrapper>
    );
    
    
}

const Wrapper = styled.div`
  height: 100%;
  margin-top: auto;
`
const FabWrapper = styled.div`
  margin-top: auto;
`