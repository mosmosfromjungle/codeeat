import React, { useState, useEffect } from 'react'

import { useAppSelector, useAppDispatch } from '../../../hooks'
import { closeBrickGameDialog } from '../../../stores/BrickGameStore'
import { DIALOG_STATUS, setDialogStatus } from '../../../stores/UserStore'
import { PlayersInterface } from '../../../stores/RoomStore'

import phaserGame from '../../../PhaserGame'
import Bootstrap from '../../../scenes/Bootstrap'
import Game from '../../../scenes/Game'

import img1 from '/assets/game/brickGame/52-2.png'
import img2 from '/assets/game/brickGame/25-2.png'
import img3 from '/assets/game/brickGame/37-2.png'
import img4 from '/assets/game/brickGame/51-2.png'
import img5 from '/assets/game/brickGame/50-2.png'
import img6 from '/assets/game/brickGame/39-2.png'

import ball from '/assets/game/brickGame/ball.png'

import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import { 
  GlobalStyle, Backdrop, Wrapper, BottomWrapper, 
  RoundWrapper, MidWrapper, HelperWrapper, QuizWrapper, OpponentWrapper, ScoreWrapper, MyWrapper, 
  OppInfo, MyInfo,
  ImageContainer, ImageText, MyBracket, CustomInput, OptionWrapper,
  CustomButton, CustomResetButton, CustomList, CommandArrayWrapper, OppBracket, OppOption, ImageArrayWrapper, 
  Answer, Left, Right
} from './BrickGameStyle'

import './BrickGame.css'

const WRONG_OPERATION = '해당 자료구조에서 사용되지 않는 연산입니다!'
const COMMON_MESSAGE = (
  <>
    <span style={{ fontSize: '22px' }}>두 캐릭터를 더하려면 </span>
    <span style={{ fontSize: '30px' }}>'sum' </span>

    <span style={{ fontSize: '22px' }}>| 처음으로 돌리려면 </span>
    <span style={{ fontSize: '30px' }}>'reset' </span>

    <span style={{ fontSize: '22px' }}>입력</span>
  </>
)

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function BrickGameDialog() {
  const dispatch = useAppDispatch()

  const username = useAppSelector((state) => state.user.username)
  const character = useAppSelector((state) => state.user.character);
  const imgpath = `/assets/character/single/${capitalizeFirstLetter(character)}_idle_anim_19.png`;

  const gamePlayers = useAppSelector((state) => state.room.gamePlayers)
  const problemType  = useAppSelector((state) => state.brickgame.brickGameState.problemType)
  const myCurrentImages = useAppSelector((state) => state.brickgame.myPlayerStatus.currentImages)
  const mySelectedOption = useAppSelector((state) => state.brickgame.myPlayerStatus.selectedOption)
  const myCommandArray = useAppSelector((state) => state.brickgame.myPlayerStatus.commandArray)
  const oppCurrentImages = useAppSelector((state) => state.brickgame.oppPlayerStatus.currentImages)
  const oppSelectedOption = useAppSelector((state) => state.brickgame.oppPlayerStatus.selectedOption)
  const oppCommandArray = useAppSelector((state) => state.brickgame.oppPlayerStatus.commandArray)

  const [problem, setProblem] = useState<string>('같은 동물 2마리만 남겨주세요!');
  const [round, setRound] = useState<number>(0)

  // My information
  const [players, setPlayers] = useState<PlayersInterface[]>([])
  const [myCharacter, setMyCharacter] = useState<string>()
  const [myPoint, setMyPoint] = useState<number>(0)
  const [myLife, setMyLife] = useState<number>(3)

  // Friend information
  const [oppUsername, setOppUsername] = useState<string>('')
  const [oppCharacter, setOppCharacter] = useState<string>()
  const [oppPoint, setOppPoint] = useState<number>(0)
  const [oppLife, setOppLife] = useState<number>(3)

  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap

  /* FETCH PLAYERS IN ROOM */
  // useEffect(() => {
  //   setPlayers(gamePlayers)
  //   console.log('game player: ', gamePlayers)

  //   gamePlayers.map((value, index) => {
  //     if (value.name === username) {
  //       // setMyCharacter(value.anim)
  //     } else {
  //       setOppUsername(value.name)
  //     }
  //   })
  // }, [gamePlayers])

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

  const handleOptionClick = (option) => {
    bootstrap.gameNetwork.brickGameCommand(option)
  }

  const handleEnter = () => {
    bootstrap.gameNetwork.brickGameCommand(command);
    setCommand('');
  }

  const handleSubmit = () => {
    bootstrap.gameNetwork.brickGameCommand('submit');
    setCommand('');
  }

  let oppLifeElements = [];
  let myLifeElements = [];

  for (let i = 0; i < oppLife; i++) {
    oppLifeElements.push(
      <img src={ ball } width="40px"></img>
    );
  }

  for (let i = 0; i < myLife; i++) {
    myLifeElements.push(
      <img src={ ball } width="40px"></img>
    );
  }

  return (
    <>
     <GlobalStyle />
      <Backdrop>
        <Wrapper>
          <IconButton
            aria-label="close dialog"
            className="close"
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>

          <RoundWrapper>
            <div style={{ flex: 1, fontSize: '24px' }} className={`${oppUsername ? '' : 'start-game'}`}>
              {oppUsername ? '친구가 들어왔어요,' : '친구가 아직 들어오지 않았어요 !'}<br />
              {oppUsername ? '게임을 진행해주세요 !' : ''}
            </div>
            <div className="title" style={{ flex: 'auto', textAlign: 'center', fontSize: '40px' }}>
              동물 멀리뛰기<br/>
              <div className="title" style={{ flex: 'auto', textAlign: 'center', fontSize: '25px' }}>
                문제에 맞는 적절한 자료구조와 명령어를 입력하여 포켓몬들을 구출해주세요 !
              </div>
            </div>
            <div style={{ flex: 1, textAlign: 'right' }}>ROUND {round}/5</div>
          </RoundWrapper>

          <MidWrapper>
            <HelperWrapper>
              💡 TIP: 문제에 <span style={{ color: 'yellow' }}>알맞은 자료구조</span>를 선택하여 <br />
              <span style={{ color: 'yellow' }}>추가 점수</span>를 얻어보세요!
              <br />
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
                  {/* {problemType} */}

                  {oppUsername ? 
                    `${problem}` :
                    '친구가 들어오면 여기에 문제가 보일거예요!'
                  }
                </span>
              </div>

              <OppOption>
                {COMMON_MESSAGE}
              </OppOption>

              {/* <ImageArrayWrapper>
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
              </ImageArrayWrapper> */}
            </QuizWrapper>
          </MidWrapper>

          <BottomWrapper>
            <OpponentWrapper>
              <ScoreWrapper>
                <div style={{ flex: 1, color: 'white', fontSize: '25px', lineHeight: '1.5' }}>
                  <OppInfo>
                    [{ oppUsername.toUpperCase() }]
                    <img src={ imgpath } width="40px" id="my-character"></img>
                  </OppInfo>
                </div>
                <div style={{ flex: 1, color: 'white', fontSize: '25px', textAlign: 'right', lineHeight: '1.5' }}>
                    { oppLifeElements }
                    <br/>
                    { oppPoint } Point <br/>
                </div>
              </ScoreWrapper>

              <ImageArrayWrapper>
                {/* <OppBracket>&#91;</OppBracket> */}
                {oppImages.map((image, index) => (
                  <ImageContainer key={index}>
                    <img
                      src={image.src}
                      alt={`Image ${index + 1}`}
                      style={{ width: '80px', height: '80px' }}
                    />
                    {/* <ImageText>{image.text}</ImageText> */}
                  </ImageContainer>
                ))}
                {/* <OppBracket>&#93;</OppBracket> */}
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
                    LIST SET STACK QUEUE DEQUE
                  </OppOption>
                )}
              </OptionWrapper>
              
              <CommandArrayWrapper>
                {oppCommandArray}
              </CommandArrayWrapper>
            </OpponentWrapper>

            <MyWrapper>
              <ScoreWrapper>
                <div style={{ flex: 1, color: 'white', fontSize: '25px', lineHeight: '1.5' }}>
                  <MyInfo>
                    [{ username.toUpperCase() }]
                    <img src={ imgpath } width="40px" id="my-character"></img>
                  </MyInfo>
                </div>
                <div style={{ flex: 1, color: 'white', fontSize: '25px', textAlign: 'right', lineHeight: '1.5' }}>
                    { myLifeElements }
                    <br/>
                    { myPoint } Point <br/>
                </div>
              </ScoreWrapper>

              <ImageArrayWrapper>
                {/* <MyBracket>&#91;</MyBracket> */}
                {myImages.map((image, index) => (
                  <ImageContainer key={index}>
                    <img
                      src={image.src}
                      alt={`Image ${index + 1}`}
                      style={{ width: '80px', height: '80px' }}
                    />
                    <ImageText>{image.text}</ImageText>
                  </ImageContainer>
                ))}
                {/* <MyBracket>&#93;</MyBracket> */}
              </ImageArrayWrapper>

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
                    <CustomButton onClick={() => handleOptionClick('list')}>LIST</CustomButton>
                    <CustomButton onClick={() => handleOptionClick('set')}>SET</CustomButton>
                    <CustomButton onClick={() => handleOptionClick('stack')}>STACK</CustomButton>
                    <CustomButton onClick={() => handleOptionClick('queue')}>QUEUE</CustomButton>
                    <CustomButton onClick={() => handleOptionClick('deque')}>DEQUE</CustomButton>
                  </div>
                )}
              </OptionWrapper>

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
              
              <div style={{ color: 'white', textAlign: 'right', padding: '10px' }}>
                잘못 제출하면 목숨이 줄어들어요!
              </div>
              <Answer>
                <Left>
                  <TextField
                    label="명령어 입력 후 엔터"
                    variant="outlined"
                    value={command}
                    onChange={(event) => setCommand(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        handleEnter();
                      }
                    }}
                    fullWidth
                    InputProps={{
                      // 친구가 들어오기 전에는 입력할 수 없도록
                      readOnly: oppUsername === '',
                      style: { fontSize: '20px', height: '50px' },
                    }}
                  />
                </Left>
                <Right>
                  <Button 
                      fullWidth
                      onClick={() => handleSubmit()}
                      style={{ height: '50px' }}>
                    제출
                  </Button>
                </Right>
              </Answer>
            </MyWrapper>
          </BottomWrapper>
        </Wrapper>
      </Backdrop>
    </>
  )
}