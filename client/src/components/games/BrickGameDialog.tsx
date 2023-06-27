import React, { useState, useEffect } from 'react'

import { useAppSelector, useAppDispatch } from '../../hooks'
import { closeBrickGameDialog } from '../../stores/BrickGameStore'
import { DIALOG_STATUS, setDialogStatus } from '../../stores/UserStore'
import { PlayersInterface } from '../../stores/RoomStore'

import phaserGame from '../../PhaserGame'
import Bootstrap from '../../scenes/Bootstrap'
import Game from '../../scenes/Game'

import img1 from '../../images/game/brickGame/52-2.png'
import img2 from '../../images/game/brickGame/25-2.png'
import img3 from '../../images/game/brickGame/37-2.png'
import img4 from '../../images/game/brickGame/51-2.png'
import img5 from '../../images/game/brickGame/50-2.png'
import img6 from '../../images/game/brickGame/39-2.png'

import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import TextField from '@mui/material/TextField'
import { 
  GlobalStyle, Backdrop, Wrapper, BottomWrapper, TopWrapper,
  RoundWrapper, MidWrapper, HelperWrapper, QuizWrapper, OpponentWrapper, MyWrapper, 
  ImageContainer, ImageText, CustomBracket, CustomInput, OptionWrapper,
  CustomButton, CustomResetButton, CustomList, CommandArrayWrapper, 
} from './BrickGameStyle'


const WRONG_OPERATION = '해당 자료구조에서 사용되지 않는 연산입니다!'
const COMMON_MESSAGE = (
  <>
    {/* <br /> */}
    <span style={{ fontSize: '22px' }}>더하기 </span>
    <span style={{ fontSize: '30px' }}>sum</span>
    {/* <span style={{ fontSize: '22px' }}> | 원래대로 </span>
    <span style={{ fontSize: '30px' }}>restore</span> */}
    <span style={{ fontSize: '22px' }}> | 게임 초기화 </span>
    <span style={{ fontSize: '30px' }}> reset</span>
    {/* <br /> */}
  </>
)

export default function BrickGameDialog() {
  const dispatch = useAppDispatch()
  const username = useAppSelector((state) => state.user.username)
  const gamePlayers = useAppSelector((state) => state.room.gamePlayers)
  const currentQuiz  = useAppSelector((state) => state.brickgame.brickGameState.currentQuiz)
  const myCurrentImages = useAppSelector((state) => state.brickgame.myPlayerStatus.currentImages)
  const mySelectedOption = useAppSelector((state) => state.brickgame.myPlayerStatus.selectedOption)
  const myCommandArray = useAppSelector((state) => state.brickgame.myPlayerStatus.commandArray)
  const oppSelectedOption = useAppSelector((state) => state.brickgame.myPlayerStatus.selectedOption)
  const oppCommandArray = useAppSelector((state) => state.brickgame.oppPlayerStatus.commandArray)
  const [players, setPlayers] = useState<PlayersInterface[]>([])
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap

  /* FETCH PLAYERS IN ROOM */
  useEffect(() => {
    setPlayers(gamePlayers)
    console.log('game player: ', gamePlayers)
  }, [gamePlayers])

  // Update selected data structure option 
  // useEffect(() => {
  //   setCurrentOption(mySelectedOption)
  //   console.log('selected option: ', currentOption)
  // }, [mySelectedOption])

  const imgsrc = [img1, img2, img3, img4, img5, img6]

  const [images, setImages] = useState<{ src: any; text: string }[]>([])
  const [command, setCommand] = useState('')

  useEffect(() => {
    setImages(myCurrentImages.map((value, index) => ({
      src: imgsrc[value.imgidx - 1],
      text: value.text
    })));
  }, [myCurrentImages]);


  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      bootstrap.gameNetwork.brickGameCommand(command)
    }
  }

  const handleOptionClick = (option) => {
    bootstrap.gameNetwork.brickGameCommand(option)
  }

  const handleClose = () => {
    try {
      const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
      bootstrap.gameNetwork.leaveGameRoom()
      dispatch(closeBrickGameDialog())
      dispatch(setDialogStatus(DIALOG_STATUS.IN_MAIN))
    } catch (error) {
      console.error('Error leaving the room:', error)
    }
  }
  
  return (
    <>
     <GlobalStyle />
      <Backdrop>
        <Wrapper>
          <RoundWrapper>
            <div style={{ flex: 1 }}></div>
            <div style={{ flex: 'auto', textAlign: 'center', fontSize: '40px' }}>동물 멀리뛰기!</div>
            <div style={{ flex: 1, textAlign: 'right' }}>ROUND 5/8</div>
          </RoundWrapper>
          <TopWrapper>
            <div id='container'>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', fontSize: '32px' }}>
                Current Players<br />
                {players.map((player, index) => (
                  <div key={index} style={{ marginLeft: '10px', textAlign: 'center' }}>
                    <div>{player.name}<br /></div>
                  </div>
                ))}
              </div>
            </div>
          </TopWrapper>

          <MidWrapper>
            <HelperWrapper>
              {/* HelperWrapper 내용 */}
              문제에 알맞은 자료구조를 선택하면 추가 점수를 얻을 수 있어요! <br /><br />
              <div style={{ fontSize: '24px ', textAlign: 'left' }}>
                List : remove()<br />
                Set : 중복제거 + remove()<br />
                Stack : pop<br />
                Queue : dequeue<br />
                Deque : pop, popleft<br />
              </div>
            </HelperWrapper>

            <QuizWrapper>
              <div style={{ fontSize: '40px', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '32px', margin: '20px' }}>
                  {/* 숫자의 합이 <span style={{ fontSize: '36px', color: 'yellow' }}> {n} </span>이 되도록
                  몬스터 배열을 수정해주세요! */}
                  {currentQuiz}
                </span>
              </div>
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
            </QuizWrapper>
          </MidWrapper>

          <BottomWrapper>
            <OpponentWrapper>
              <OptionWrapper>
              {oppSelectedOption === 'list' ? (
                <CustomList>
                  <span style={{ fontSize: '32px', color: 'yellow' }}>List</span> - 
                  remove(), pop<br />
                  {COMMON_MESSAGE}
                  <br />
                </CustomList>
              ) : oppSelectedOption === 'set' ? (
                <CustomList>
                  <span style={{ fontSize: '32px', color: 'yellow' }}>Set</span> - 
                  remove(), discard()<br />
                  {COMMON_MESSAGE}
                  <br />
                </CustomList>
              ) : oppSelectedOption === 'stack' ? (
                <CustomList>
                  <span style={{ fontSize: '32px', color: 'yellow' }}>Stack</span> - 
                  pop<br />
                  {COMMON_MESSAGE}
                  <br />
                </CustomList>
              ) : oppSelectedOption === 'queue' ? (
                <CustomList>
                  <span style={{ fontSize: '32px', color: 'yellow' }}>Queue</span> - 
                  dequeue<br />
                  {COMMON_MESSAGE}
                  <br />
                </CustomList>
              ) : oppSelectedOption === 'deque' ? (
                <CustomList>
                  <span style={{ fontSize: '32px', color: 'yellow' }}>Deque</span> - 
                  pop, popleft<br />
                  {COMMON_MESSAGE}
                  <br />
                </CustomList>
              ) : (
                <div>
                  <br /><br />
                  <CustomButton onClick={() => handleOptionClick('list')}>list</CustomButton>
                  <CustomButton onClick={() => handleOptionClick('set')}>set</CustomButton>
                  <CustomButton onClick={() => handleOptionClick('stack')}>stack</CustomButton>
                  <CustomButton onClick={() => handleOptionClick('queue')}>queue</CustomButton>
                  <CustomButton onClick={() => handleOptionClick('deque')}>deque</CustomButton>
                  <br /><br /><br />
                </div>
              )}
              </OptionWrapper>
              <CommandArrayWrapper>
                {oppCommandArray}
              </CommandArrayWrapper>
            </OpponentWrapper>

            <MyWrapper>
              <OptionWrapper>
              {mySelectedOption === 'list' ? (
                <CustomList>
                  <span style={{ fontSize: '32px', color: 'yellow' }}>List</span> - 
                  remove(), pop<br />
                  {COMMON_MESSAGE}
                  <br />
                </CustomList>
              ) : mySelectedOption === 'set' ? (
                <CustomList>
                  <span style={{ fontSize: '32px', color: 'yellow' }}>Set</span> - 
                  remove(), discard()<br />
                  {COMMON_MESSAGE}
                  <br />
                </CustomList>
              ) : mySelectedOption === 'stack' ? (
                <CustomList>
                  <span style={{ fontSize: '32px', color: 'yellow' }}>Stack</span> - 
                  pop<br />
                  {COMMON_MESSAGE}
                  <br />
                </CustomList>
              ) : mySelectedOption === 'queue' ? (
                <CustomList>
                  <span style={{ fontSize: '32px', color: 'yellow' }}>Queue</span> - 
                  dequeue<br />
                  {COMMON_MESSAGE}
                  <br />
                </CustomList>
              ) : mySelectedOption === 'deque' ? (
                <CustomList>
                  <span style={{ fontSize: '32px', color: 'yellow' }}>Deque</span> - 
                  pop, popleft<br />
                  {COMMON_MESSAGE}
                  <br />
                </CustomList>
              ) : (
                <div>
                  <br /><br />
                  <CustomButton onClick={() => handleOptionClick('list')}>list</CustomButton>
                  <CustomButton onClick={() => handleOptionClick('set')}>set</CustomButton>
                  <CustomButton onClick={() => handleOptionClick('stack')}>stack</CustomButton>
                  <CustomButton onClick={() => handleOptionClick('queue')}>queue</CustomButton>
                  <CustomButton onClick={() => handleOptionClick('deque')}>deque</CustomButton>
                  <br /><br /><br />
                </div>
              )}
              </OptionWrapper>
              <CommandArrayWrapper>
                {oppCommandArray}
              </CommandArrayWrapper>
              {/* <CustomInput
                type="text"
                // value={command}
                onChange={(event) => setCommand(event.target.value)}
                onKeyDown={handleKeyDown} // 키 다운 이벤트 핸들러 추가
                style={{ margin: '10px' }}
              /> */}
              <TextField
                label="Enter Command"
                variant="outlined"
                value={command}
                onChange={(event) => setCommand(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    setCommand('');
                    bootstrap.gameNetwork.brickGameCommand(command);
                  }
                }}
                fullWidth
                InputProps={{
                  style: { fontSize: '24px' },
                }}
              />
            </MyWrapper>
          </BottomWrapper>

          <IconButton
            aria-label="close dialog"
            className="close"
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </Wrapper>
      </Backdrop>
    </>
  )
}