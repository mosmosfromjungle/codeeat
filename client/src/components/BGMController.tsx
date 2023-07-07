import Fab from '@mui/material/Fab'
import styled from 'styled-components';
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined';
import VolumeOffOutlinedIcon from '@mui/icons-material/VolumeOffOutlined';
import { useState, useEffect } from 'react';
import BGM from '../../public/assets/audios/BGM.mp3';
import { HelperButton } from './GlobalStyle';

export default function () {
  const [BGMstate, setBGMstate] = useState<boolean>(true);
  const [audio] = useState<HTMLAudioElement | null>(
    typeof Audio === 'undefined' ? null : new Audio(BGM)
  );

  useEffect(() => {
    if (!audio) return;
    audio.addEventListener(
      'ended',
      function () {
        audio.currentTime = 0;
        audio.play();
      },
      false
    );
  }, []);

  useEffect(() => {
    BGMstate ? audio?.play() : audio?.pause();
  }, [BGMstate]);

  const handleBGM = () => {
    setBGMstate(!BGMstate);
  };

  return (
    <Wrapper>
      <FabWrapper>
        <HelperButton 
          disableRipple
          onClick={handleBGM}>
          {BGMstate ? (
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