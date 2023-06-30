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
  ImageContainer, ImageText, MyBracket, CustomInput, OptionWrapper,
  CustomButton, CustomResetButton, CustomList, CommandArrayWrapper, OppBracket, OppOption, ImageArrayWrapper, 
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
  const oppCurrentImages = useAppSelector((state) => state.brickgame.oppPlayerStatus.currentImages)
  const oppSelectedOption = useAppSelector((state) => state.brickgame.oppPlayerStatus.selectedOption)
  const oppCommandArray = useAppSelector((state) => state.brickgame.oppPlayerStatus.commandArray)
  const [players, setPlayers] = useState<PlayersInterface[]>([])
  // const [me, setMe] = useState<string>()
  const [myCharacter, setMyCharacter] = useState<string>()
  const [oppUsername, setOppUsername] = useState<string>()
  const [oppCharacter, setOppCharacter] = useState<string>()
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap

  /* FETCH PLAYERS IN ROOM */
  useEffect(() => {
    setPlayers(gamePlayers)
    console.log('game player: ', gamePlayers)

    gamePlayers.map((value, index) => {
      if (value.name === username) {
        // setMyCharacter(value.anim)
      } else {
        setOppUsername(value.name)
      }
    })

  }, [gamePlayers])

  // Update selected data structure option 
  // useEffect(() => {
  //   setCurrentOption(mySelectedOption)
  //   console.log('selected option: ', currentOption)
  // }, [mySelectedOption])

  const imgsrc = [img1, img2, img3, img4, img5, img6]

  const [myImages, setMyImages] = useState<{ src: any; text: string }[]>([])
  const [oppImages, setOppImages] = useState<{ src: any; text: string }[]>([])
  const [command, setCommand] = useState('')

  useEffect(() => {
    setMyImages(myCurrentImages.map((value, index) => ({
      src: imgsrc[value.imgidx - 1],
      text: value.text
    })))
  }, [myCurrentImages])

  useEffect(() => {
    setOppImages(oppCurrentImages.map((value, index) => ({
      src: imgsrc[value.imgidx - 1],
      text: value.text
    })));
  }, [oppCurrentImages]);


  // const handleKeyDown = (event) => {
  //   if (event.key === 'Enter') {
  //     bootstrap.gameNetwork.brickGameCommand(command)
  //   }
  // }

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
            <div id='container' style={{ display: 'flex', flexDirection: 'row' }}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', fontSize: '32px', lineHeight: '1.5', textAlign: 'center', padding: '0 120px' }}>
                {/* {players.map((player, index) => (
                  <div key={index} style={{ marginLeft: '10px', textAlign: 'center' }}>
                    <div>player {index + 1}: {player.name}<br /></div>
                  </div>
                ))} */}
                {/* 나 : {username} 점수 : 8 Point
                <br />
                상대 : {oppUsername} 점수 : 6 Point */}
                상대 : {oppUsername} <br />
                점수 : 6 Point
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', fontSize: '32px', lineHeight: '1.5', textAlign: 'center', padding: '0 120px' }}>
                나 : {username} <br />
                점수 : 8 Point
              </div>
            </div>
          </TopWrapper>

          <MidWrapper>
            <HelperWrapper>
              문제에 <span style={{ color: 'yellow' }}>알맞은 자료구조</span>를 선택해 <span style={{ color: 'yellow' }}>추가 점수</span>를 얻어보세요!
              <br /><br />
              <div style={{ fontSize: '24px ', textAlign: 'left' }}>
                <span style={{ color: 'yellow' }}>List</span> : remove()<br />
                <span style={{ color: 'yellow' }}>Set</span> : remove() + 중복 제거<br />
                <span style={{ color: 'yellow' }}>Stack</span> : pop<br />
                <span style={{ color: 'yellow' }}>Queue</span> : dequeue<br />
                <span style={{ color: 'yellow' }}>Deque</span> : pop, popleft<br />
              </div>
            </HelperWrapper>

            <QuizWrapper>
              <div style={{ fontSize: '40px', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '32px', margin: '20px' }}>
                  {/* 숫자의 합이 <span style={{ fontSize: '36px', color: 'yellow' }}> {n} </span>이 되도록
                  몬스터 배열을 수정해주세요! */}
                  {/* {currentQuiz} */}
                  같은 동물 <span style={{ fontSize: '36px', color: 'yellow' }}> 2 </span>마리만 남겨주세요!
                </span>
              </div>
              <ImageArrayWrapper>
                <MyBracket>&#91;</MyBracket>
                {myImages.map((image, index) => (
                  <ImageContainer key={index}>
                    <img
                      src={image.src}
                      alt={`Image ${index + 1}`}
                      style={{ width: '100px', height: '100px' }}
                    />
                    <ImageText>{image.text}</ImageText>
                  </ImageContainer>
                ))}
                <MyBracket>&#93;</MyBracket>
              </ImageArrayWrapper>
            </QuizWrapper>
          </MidWrapper>

          <BottomWrapper>
            <OpponentWrapper>
              <div style={{ color: 'white', fontSize: '28px', textAlign: 'center', lineHeight: '1.5' }}>
                상대 : {oppUsername}
              </div>
              <ImageArrayWrapper>
                <OppBracket>&#91;</OppBracket>
                {oppImages.map((image, index) => (
                  <ImageContainer key={index}>
                    <img
                      src={image.src}
                      alt={`Image ${index + 1}`}
                      style={{ width: '60px', height: '60px' }}
                    />
                    {/* <ImageText>{image.text}</ImageText> */}
                  </ImageContainer>
                ))}
                <OppBracket>&#93;</OppBracket>
              </ImageArrayWrapper>
              <OptionWrapper>
              {oppSelectedOption === 'list' ? (
                <CustomList>
                  <span style={{ fontSize: '32px', color: 'yellow' }}>List</span> - 
                  remove(), pop<br />
                </CustomList>
              ) : oppSelectedOption === 'set' ? (
                <CustomList>
                  <span style={{ fontSize: '32px', color: 'yellow' }}>Set</span> - 
                  remove(), discard()<br />
                </CustomList>
              ) : oppSelectedOption === 'stack' ? (
                <CustomList>
                  <span style={{ fontSize: '32px', color: 'yellow' }}>Stack</span> - 
                  pop<br />
                </CustomList>
              ) : oppSelectedOption === 'queue' ? (
                <CustomList>
                  <span style={{ fontSize: '32px', color: 'yellow' }}>Queue</span> - 
                  dequeue<br />
                </CustomList>
              ) : oppSelectedOption === 'deque' ? (
                <CustomList>
                  <span style={{ fontSize: '32px', color: 'yellow' }}>Deque</span> - 
                  pop, popleft<br />
                </CustomList>
              ) : (
                <OppOption>
                  {/* ㄴ<br />  */}
                  LIST SET STACK QUEUE DEQUE
                  {/* <CustomButton onClick={() => handleOptionClick('list')}>list</CustomButton>
                  <CustomButton onClick={() => handleOptionClick('set')}>set</CustomButton>
                  <CustomButton onClick={() => handleOptionClick('stack')}>stack</CustomButton>
                  <CustomButton onClick={() => handleOptionClick('queue')}>queue</CustomButton>
                  <CustomButton onClick={() => handleOptionClick('deque')}>deque</CustomButton> */}
                  {/* <br /> */}
                </OppOption>
              )}
              </OptionWrapper>
              <CommandArrayWrapper>
                {oppCommandArray}
              </CommandArrayWrapper>
            </OpponentWrapper>

            <MyWrapper>
              <div style={{ color: 'white', fontSize: '28px', textAlign: 'center', lineHeight: '1.5' }}>
                나 : {username}
              </div>
              <OptionWrapper>
              {mySelectedOption === 'list' ? (
                <CustomList>
                  <span style={{ fontSize: '32px', color: 'yellow' }}>List</span> - 
                  remove(), pop<br />
                </CustomList>
              ) : mySelectedOption === 'set' ? (
                <CustomList>
                  <span style={{ fontSize: '32px', color: 'yellow' }}>Set</span> - 
                  remove(), discard()<br />
                </CustomList>
              ) : mySelectedOption === 'stack' ? (
                <CustomList>
                  <span style={{ fontSize: '32px', color: 'yellow' }}>Stack</span> - 
                  pop<br />
                </CustomList>
              ) : mySelectedOption === 'queue' ? (
                <CustomList>
                  <span style={{ fontSize: '32px', color: 'yellow' }}>Queue</span> - 
                  dequeue<br />
                </CustomList>
              ) : mySelectedOption === 'deque' ? (
                <CustomList>
                  <span style={{ fontSize: '32px', color: 'yellow' }}>Deque</span> - 
                  pop, popleft<br />
                </CustomList>
              ) : (
                <div>
                  <br />
                  <CustomButton onClick={() => handleOptionClick('list')}>list</CustomButton>
                  <CustomButton onClick={() => handleOptionClick('set')}>set</CustomButton>
                  <CustomButton onClick={() => handleOptionClick('stack')}>stack</CustomButton>
                  <CustomButton onClick={() => handleOptionClick('queue')}>queue</CustomButton>
                  <CustomButton onClick={() => handleOptionClick('deque')}>deque</CustomButton>
                  <br />
                </div>
              )}
              </OptionWrapper>
              <OppOption>
                {COMMON_MESSAGE}
              </OppOption>
              <CommandArrayWrapper>
                {myCommandArray}
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