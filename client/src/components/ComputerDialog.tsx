import React, { useState, useEffect } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { io, Socket } from 'socket.io-client';
import phaserGame from '../PhaserGame';
import Game from '../../src/scenes/Game';

import { useAppSelector, useAppDispatch } from '../hooks'
import { closeComputerDialog } from '../stores/DataGameStore'

interface Player {
  id: any;
  score: number;
}

const socket = io('http://localhost:3001')

const WRONG_OPERATION = '해당 자료구조에서 사용되지 않는 연산입니다!'
const COMMON_MESSAGE = (
  <>
    <br />
    <span style={{ fontSize: '22px' }}>더하기 </span>
    <span style={{ fontSize: '30px' }}>sum</span>
    <span style={{ fontSize: '22px' }}> | 원래대로 </span>
    <span style={{ fontSize: '30px' }}>restore</span>
    <span style={{ fontSize: '22px' }}> | 게임 초기화 </span>
    <span style={{ fontSize: '30px' }}> reset</span>
    <br />
  </>
);

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
const CustomBracket = styled.div`
  position: relative;
  font-family: 'CustomFont', sans-serif;
  font-size: 32px;
  margin-top: 60px;
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
  && {
    font-family: 'CustomFont', sans-serif;
    font-size: 32px;
    color: white;
    &:hover {
      color: blue;
  }
`
const CustomResetButton = styled(Button)`
  && {
    font-family: 'CustomFont', sans-serif;
    font-size: 24px;
    color: white;
    &:hover {
      color: blue;
  }
`
const CustomList = styled.div`
  font-family: 'CustomFont', sans-serif;
  font-size: 28px;
  color: white;
  width: 80%;
  line-height: 1.5;
  text-align: center;

`
function getRandomIntInclusive(min:number, max:number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function ComputerDialog() {
  const [n, setN] = useState(0)
  const [m, setM] = useState(0)
  const [x, setX] = useState(0)
  
  useEffect(() => {
    setNum();
  }, []);
  
  const setNum = () => {
    const newN = getRandomIntInclusive(1, 100);
    const newM = getRandomIntInclusive(1, newN);
    const newX = newN - newM;

    setN(newN)
    setM(newM)
    setX(newX)
    
  }

  const[array, setArray] = useState([0, 0, 0, 0, 0, 0])
  useEffect(() => {
    setArr();
  }, [])
  const setArr = () => {
    const a = getRandomIntInclusive(1,n)
    const b = getRandomIntInclusive(1,n)
    const c = getRandomIntInclusive(1,n)
    

    setArray([a, b, c, n, m, x].sort(() => Math.random() - 0.5))
  }
  const arr = array
  const answer = n

  const dispatch = useAppDispatch()
  const [players, setPlayers] = useState<Player[]>([])

  socket.on('new-player', (id) => {
    setPlayers((prevPlayers) => [...prevPlayers, { id, score: 0}])
  })
  socket.on('addScore',(data) => {
          const { playerId, score } = data
          if (score === 10) {
            socket.emit('win', socket)
            return
          }

          setPlayers((prevPlayers) => {
            return prevPlayers.map((player) => {
              if (player.id === playerId) {
                return { ...player, score:score}
              }
              return player
            })
          })
  })
  socket.on('gameEnd', () => {
    console.log('GAME OVER')
    handleReset()
  })


  const [images, setImages] = useState([
    { src: '/assets/brickGame/52-2.png', text: arr[0].toString() },
    { src: '/assets/brickGame/25-2.png', text: arr[1].toString() },
    { src: '/assets/brickGame/37-2.png', text: arr[2].toString() },
    { src: '/assets/brickGame/51-2.png', text: arr[3].toString() },
    { src: '/assets/brickGame/50-2.png', text: arr[4].toString() },
    { src: '/assets/brickGame/39-2.png', text: arr[5].toString() },
  ],)

  const [originalImages, setOriginalImages] = useState([...images]) // 원래의 이미지 배열 복사
  const [command, setCommand] = useState('')
  const [selectedOption, setSelectedOption] = useState('')

  const handleRemoveImage = () => {
    const match = command.match(/remove\((\d+)\)/) || command.match(/discard\((\d+)\)/);
    if (match) {
      const number = match[1];
      const index = images.findIndex((image) => image.text === number);
      if (index !== -1) {
        removeImage(index);
      }
    } else {
      alert('제거할 숫자를 같이 입력해주세요.');
    }
    setCommand('');
  };

  const removeImage = (index) => {
    setImages((prevImages) => {
      const newImages = [...prevImages]
      newImages.splice(index, 1)
      return newImages
    })
  }

  const restoreImages = () => {
    setImages([...originalImages]) // 원래의 이미지 배열로 복구
  }

  const handleCommand = () => {
    const lowercaseCommand = command.toLowerCase();
    if (lowercaseCommand === 'sum') {
      const sum = images.reduce((total, image) => total + parseInt(image.text), 0);
      if (n == sum) {
        socket.emit('gotAnswer', socket)
        alert('정답입니다');
        handleReset();
      } else {
        restoreImages();
      }
    } else if (lowercaseCommand === 'restore') {
      restoreImages(); // 이미지 복구
    } else if (lowercaseCommand === 'reset') {
      handleReset();
    } else {
      switch (selectedOption) {
        case 'list':
          if (lowercaseCommand.startsWith('remove')) {
            handleRemoveImage();
          } else if (lowercaseCommand === 'pop') {
            removeImage(images.length - 1);
          } else {
            alert(WRONG_OPERATION);
          }
          break;
        case 'set':
          if (lowercaseCommand.startsWith('remove') || lowercaseCommand.startsWith('discard')) {
            handleRemoveImage();
          } else {
            alert(WRONG_OPERATION);
          }
          break;
        case 'stack':
          if (lowercaseCommand === 'pop') {
            removeImage(images.length - 1);
          } else {
            alert(WRONG_OPERATION);
          }
          break;
        case 'queue':
          if (lowercaseCommand === 'dequeue') {
            removeImage(0);
          } else {
            alert(WRONG_OPERATION);
          }
          break;
        case 'deque':
          if (lowercaseCommand === 'popleft') {
            removeImage(0);
          } else if (lowercaseCommand === 'pop') {
            removeImage(images.length - 1);
          } else {
            alert(WRONG_OPERATION);
          }
          break;
        default:
          if (lowercaseCommand === 'list') {
            setSelectedOption('list');
          } else if (lowercaseCommand === 'set') {
            setSelectedOption('set');
          } else if (lowercaseCommand === 'stack') {
            setSelectedOption('stack');
          } else if (lowercaseCommand === 'queue') {
            setSelectedOption('queue');
          } else if (lowercaseCommand === 'deque') {
            setSelectedOption('deque');
          } else {
            alert(`자료구조를 입력해주세요!`);
          }
          break;
      }
    }
    setCommand('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleCommand()
    }
  }

  const handleOptionClick = (option) => {
    setSelectedOption(option)
  }

  const handleReset = () => {
    setImages([...originalImages])
    setSelectedOption('')
    setNum()
  }
  return (
    
    <>
      <GlobalStyle />

      <Backdrop>

        <Wrapper>
          <div id='container'>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div>
          {players.map((player) => (
            <div key={player.id}>
              <li>{player.id}, {player.score}</li>
              </div>
          ))}
        </div>
        </div>
        </div>
          <div style={{ fontSize: '40px' }}>
            몬스터 줄세우기!
            <br></br>
            <br></br>
          </div>

          <div style={{ fontSize: '40px', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '24px', marginLeft: '10px' }}>
              숫자의 합이 <span style={{ fontSize: '36px', color: 'yellow' }}> {answer} </span>이 되도록
              몬스터 배열을 수정해주세요!
            </span>
          </div>
          
          <br></br><br></br>
          <br></br><br></br>
          <br></br>

          <IconButton
            aria-label="close dialog"
            className="close"
            onClick={() => dispatch(closeComputerDialog())}
          >
            <CloseIcon />
          </IconButton>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CustomBracket>&#91;</CustomBracket>
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
            <CustomBracket>&#93;</CustomBracket>
          </div>

          {selectedOption === 'list' ? (
            <CustomList>
              <br></br>
              <span style={{ fontSize: '32px', color: 'yellow' }}>List</span><br></br>
              {/* <br></br>
              삽입(Insertion): append, insert<br></br> */}
              삭제(Deletion): remove(), pop<br></br>
              {COMMON_MESSAGE}
              <br></br>
            </CustomList>
          ) : selectedOption === 'set' ? (
            <CustomList>
              <br></br>
              <span style={{ fontSize: '32px', color: 'yellow' }}>Set</span><br></br>
              {/* <br></br>
              삽입(Insertion): add<br></br> */}
              삭제(Deletion): remove(), discard()<br></br>
              {COMMON_MESSAGE}
              <br></br>
            </CustomList>
          ) : selectedOption === 'stack' ? (
            <CustomList>
              <br></br>
              <span style={{ fontSize: '32px', color: 'yellow' }}>Stack</span><br></br>
              {/* <br></br>
              삽입(Insertion): push, append<br></br> */}
              삭제(Deletion): pop<br></br>
              {COMMON_MESSAGE}
              <br></br>
            </CustomList>
          ) : selectedOption === 'queue' ? (
            <CustomList>
              <br></br>
              <span style={{ fontSize: '32px', color: 'yellow' }}>Queue</span><br></br>
              {/* <br></br>
              삽입(Insertion): enqueue<br></br> */}
              삭제(Deletion): dequeue<br></br>
              {COMMON_MESSAGE}
              <br></br>
            </CustomList>
          ) : selectedOption === 'deque' ? (
            <CustomList>
              <br></br>
              <span style={{ fontSize: '32px', color: 'yellow' }}>Deque</span><br></br>
              {/* <br></br>
              삽입(Insertion): append, appendleft<br></br> */}
              삭제(Deletion): pop, popleft<br></br>
              {COMMON_MESSAGE}
              <br></br>
            </CustomList>
          ) : (
            <div>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
              <CustomButton onClick={() => handleOptionClick('list')}>list</CustomButton>
              <CustomButton onClick={() => handleOptionClick('set')}>set</CustomButton>
              <CustomButton onClick={() => handleOptionClick('stack')}>stack</CustomButton>
              <CustomButton onClick={() => handleOptionClick('queue')}>queue</CustomButton>
              <CustomButton onClick={() => handleOptionClick('deque')}>deque</CustomButton>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <CustomInput
              type="text"
              value={command}
              onChange={(event) => setCommand(event.target.value)}
              onKeyDown={handleKeyDown} // 키 다운 이벤트 핸들러 추가
              style={{ margin: '10px' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <CustomResetButton onClick={handleReset}>게임 초기화</CustomResetButton>
          </div>
        </Wrapper>
      </Backdrop>
    </>
  )
}