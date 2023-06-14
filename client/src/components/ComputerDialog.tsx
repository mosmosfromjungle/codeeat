import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

import { useAppSelector, useAppDispatch } from '../hooks'
import { closeComputerDialog } from '../stores/ComputerStore'

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'CustomFont';
    src: url('/assets/fonts/neodgm_code.woff') format('woff');
  }

  body {
    font-family: 'CustomFont', sans-serif;
  }
`

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 16px 180px 16px 16px;
`
const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: #222639;
  border-radius: 16px;
  padding: 16px;
  color: #eee;
  background-color: black;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 5px #0000006f;
  justify-content: center;
  align-items: center;

  .close {
    position: absolute;
    top: 0px;
    right: 0px;
  }
`

const ImageContainer = styled.div`
  position: relative;
  margin: 10px;
`

const ImageText = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 8px;
  // background-color: rgba(0, 0, 0, 0.6);
  color: white;
  font-family: 'CustomFont', sans-serif;
  font-size: 40px;
  font-weight: bold;
  text-align: center;
  text-shadow: 0px 0px 12px rgba(0, 0, 0, 0.9); /* 텍스트 그림자 스타일링 */
`

const CustomInput = styled.input`
  font-family: 'CustomFont', sans-serif;
  font-size: 32px;
  color: white;
  background-color: black;
  width: 80%;
  // height: 100px;
`

const CustomButton = styled(Button)`
  font-family: 'CustomFont', sans-serif;
  font-size: 32px;
`

const CustomList = styled.div`
  font-family: 'CustomFont', sans-serif;
  font-size: 28px;
  color: white;
  width: 80%;
`

export default function ComputerDialog() {
  const dispatch = useAppDispatch()
  // const playerNameMap = useAppSelector((state) => state.user.playerNameMap)
  const [images, setImages] = useState([
    { src: '/assets/brickGame/52-2.png', text: '5' },
    { src: '/assets/brickGame/25-2.png', text: '2' },
    { src: '/assets/brickGame/37-2.png', text: '7' },
    { src: '/assets/brickGame/51-2.png', text: '3' },
    { src: '/assets/brickGame/50-2.png', text: '9' },
    { src: '/assets/brickGame/39-2.png', text: '8' },
  ]);
  
  const [originalImages, setOriginalImages] = useState([...images]); // 원래의 이미지 배열 복사

  const removeImage = (index) => {
    setImages(prevImages => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const [command, setCommand] = useState('');

  const restoreImages = () => {
    setImages([...originalImages]); // 원래의 이미지 배열로 복구
  };
  
  const handleCommand = () => {
    const lowercaseCommand = command.toLowerCase();
    if (lowercaseCommand === 'popleft') {
      removeImage(0);
    } else if (lowercaseCommand === 'pop') {
      removeImage(images.length - 1);
    } else if (lowercaseCommand === 'sum') {
      const sum = images.reduce((total, image) => total + parseInt(image.text), 0);
      alert(`Sum: ${sum}`);
    } else if (lowercaseCommand === 'restore') {
      restoreImages(); // 이미지 복구
    }
    setCommand('');
  };
  
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleCommand();
    }
  };

  return (
    <>
    <GlobalStyle />

    <Backdrop>
      <Wrapper>
        <div style={{ fontSize: '40px' }}>
          괴물을 이겨라!<br></br>
          <br></br>
          <br></br>
        </div>

        <IconButton
          aria-label="close dialog"
          className="close"
          onClick={() => dispatch(closeComputerDialog())}
        >
          <CloseIcon />
        </IconButton>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {images.map((image, index) => (
            <ImageContainer key={index}>
              <img 
                src={image.src} 
                alt={`Image ${index + 1}`} 
                style={{ width: '100px', height: '100px' }} 
              />
              <ImageText>{image.text}</ImageText>
            </ImageContainer>
          ))}
        </div>

        <CustomList>
          <br></br>
          <br></br>
          <br></br>
          pop<br></br>
          popleft<br></br>
          sum<br></br>
          restore<br></br>
        </CustomList>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <CustomInput
            type="text"
            value={command}
            onChange={(event) => setCommand(event.target.value)}
            onKeyDown={handleKeyDown} // 키 다운 이벤트 핸들러 추가
            style={{ margin: '10px' }}
          />
          {/* <CustomButton onClick={handleCommand}>명령어 실행</CustomButton> */}
        </div>

      </Wrapper>
    </Backdrop>
    </>
  )
}
