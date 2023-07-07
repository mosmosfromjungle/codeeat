import Fab from '@mui/material/Fab'
import styled from 'styled-components';
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined';
import VolumeOffOutlinedIcon from '@mui/icons-material/VolumeOffOutlined';
import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks';
import { toggleMainBgm } from '../stores/AudioStore';

export default function BGMController() {
  const dispatch = useAppDispatch();  
  const playingBGM = useAppSelector((state) => state.audio.MainBgm)

  const handleToggle = () => {
    dispatch(toggleMainBgm());
  }

  return (
    <Wrapper>
      <FabWrapper>
        <CustomFab onClick={handleToggle}>
          {playingBGM ? (
            <VolumeUpOutlinedIcon fontSize="large" sx={{ color: 'black' }} />
            ) : (
            <VolumeOffOutlinedIcon fontSize="large" sx={{ color: 'black' }} />
          )}
        </CustomFab>
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
const CustomFab = styled(Fab)`
  position: relative;
  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: -2px;
    width: 60px;
    height: 60px;
    shape-rendering: crispEdges;
    z-index: -1;
    background: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 -0.5 14 13" shape-rendering="crispEdges"
      %3E%3Cmetadata%3EMade with Pixels to Svg https://codepen.io/shshaw/pen/XbxvNj%3C/metadata%3E%3Cpath 
      stroke="%23222034" d="M3 0h8M2 1h1M11 1h1M1 2h1M12 2h1M0 3h1M13 3h1M0 4h1M13 4h1M0 5h1M13 5h1M0 6h1M13 6h1M0 7h1M13 7h1M0 8h1M13 8h1M0 9h1M13 9h1M1 10h1M12 10h1M2 11h1M11 11h1M3 12h8" /%3E%3Cpath 
      stroke="%23e2f0ea" d="M3 1h8M2 2h10M1 3h12M1 4h12M1 5h12M1 6h12M1 7h12M1 8h12M1 9h12M2 10h10M3 11h8" /%3E%3C/svg%3E');
  }
`