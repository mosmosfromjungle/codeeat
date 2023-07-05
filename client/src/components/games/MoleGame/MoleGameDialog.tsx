import React, { useRef, useState, useEffect } from 'react'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
// import Button from '@mui/material/Button'

import { useAppSelector, useAppDispatch } from '../../../hooks'
import { closeMoleGameDialog } from '../../../stores/MoleGameStore'
import { DIALOG_STATUS, setDialogStatus } from '../../../stores/UserStore'

import ButtonBGM from '/assets/audios/mole_button.mp3';
import CorrectBGM from '/assets/audios/mole_correct.mp3';
import WrongBGM from '/assets/audios/mole_wrong.mp3';
import FinishBGM from '/assets/audios/mole_finish.mp3';

import hammer from '/assets/game/molegame/hammer.png';

import { 
  Backdrop, Wrapper, RoundArea, Header, 
  Comment, Problem, ProblemText, TipArea, Content, 
  Moles, MyPoint, YourPoint, IsWinner, IsHost, CharacterArea, NameArea, LifeArea, PointArea, 
} from './MoleGameStyle'
import './MoleGame.css'

import phaserGame from '../../../PhaserGame'
import Bootstrap from '../../../scenes/Bootstrap'
import { updateLevel, UpdateLevelReqest } from '../../../apicalls/auth'
import ExperienceResultModal from '../../ExperienceResultModal'

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function MoleGameDialog() {
  // For communication between client and server
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap

  // My information
  const username = useAppSelector((state) => state.user.username);
  const character = useAppSelector((state) => state.user.character);
  const imgpath = `/assets/character/single/${capitalizeFirstLetter(character)}.png`;

  // Send my info to friend (client -> server)
  bootstrap.gameNetwork.sendMyInfo(username, character)

  // Friend information
  const friendname = useAppSelector((state) => state.molegame.friendName);
  const friendcharacter = useAppSelector((state) => state.molegame.friendCharacter);
  const friendimgpath = `/assets/character/single/${capitalizeFirstLetter(friendcharacter)}.png`;
  
  // Get room host information
  const host = useAppSelector((state) => state.molegame.host)

  const dispatch = useAppDispatch()

  const [flag, setFlag] = useState(0)
  const [titleColor, setTitleColor] = useState('#f2ecff')

  const [problemText, setProblemText] = useState('정답을 말하고 있는 두더지를 잡아라!')

  const [answerText1, setAnswerText1] = useState(String)
  const [answerText2, setAnswerText2] = useState(String)
  const [answerText3, setAnswerText3] = useState(String)
  const [answerText4, setAnswerText4] = useState(String)
  const [answerText5, setAnswerText5] = useState(String)
  const [answerText6, setAnswerText6] = useState(String)
  const [answerText7, setAnswerText7] = useState(String)
  const [answerText8, setAnswerText8] = useState(String)
  const [answerText9, setAnswerText9] = useState(String)

  const [startButtonColor, setStartButtonColor] = useState('')
  const [startButtonText, setStartButtonText] = useState('PRESS START')
  const [startButton, setStartButton] = React.useState(false)

  const [activeNumber, setActiveNumber] = useState(0)
  const [activeNumberList, setActiveNumberList] = useState([0, 0, 0])

  const [canClick, setCanClick] = useState(true)
  const [startGame, setStartGame] = useState(false)

  const [myLife, setMyLife] = useState(3)
  const [myPoint, setMyPoint] = useState(0)
  const [turn, setTurn] = useState(0)

  const [winner, setWinner] = useState(String)

  const [moleCatch, setMoleCatch] = useState(0)

  // If friend get point, display event
  const friendPoint = useAppSelector((state) => state.molegame.friendPoint)

  // If friend click wrong, display event
  const friendLife = useAppSelector((state) => state.molegame.friendLife)

  const problem = useAppSelector((state) => state.molegame.problem)

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const openModal = () => {
    setTimeout(() => {
      setIsModalOpen(true)
    }, 200)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    handleClose();
  }

  let randomNumber1 = 0
  let randomNumber2 = 0
  let randomNumber3 = 0

  let moleNumber1 = 0
  let moleNumber2 = 0
  let moleNumber3 = 0

  // 친구 점수가 올랐을 때 내 화면에도 표시해주어야 함
  useEffect(() => {
    if (friendPoint !== '0') {
      // Point and Character event
      const friendPoint = document.getElementById('friend-point-current')
      friendPoint.classList.add('get-point')

      setTimeout(function () {
        friendPoint.classList.remove('get-point')
      }, 1000)

      const friendCharacter = document.getElementById('friend-character')
      friendCharacter.classList.add('jump-animation')

      setTimeout(function () {
        friendCharacter.classList.remove('jump-animation')
      }, 1000)
    }
  }, [friendPoint])

  // 친구/내 목숨 이벤트 처리
  let friendLifeElements = []
  let myLifeElements = []

  for (let i = 0; i < parseInt(friendLife); i++) {
    friendLifeElements.push(<img key={i} src={hammer} width="60px" style={{ margin: '5px' }}></img>)
  }

  for (let i = 0; i < myLife; i++) {
    myLifeElements.push(<img key={i} src={hammer} width="60px" style={{ margin: '5px' }}></img>)
  }

  // 1. Load problems

  const problems = [
    ['파이썬에서 리스트에 들어있는 모든 수를 합하는 함수는?', ['sum', 'len', 'map']],
    ['파이썬에서 리스트의 원소 개수를 구하는 함수는?', ['len', 'abs', 'map']],
    ['파이썬에서 새로운 정렬된 리스트를 반환하는 함수는?', ['sorted', 'len', 'sort']],
    ['파이썬에서 리스트 자체를 정렬시켜버리는 것은?', ['sort', 'len', 'sorted']],
    ['파이썬에서 내림차순 정렬을 위해 사용하는 옵션은?', ['reverse', 'len', 'map']],
    ['파이썬에서 숫자의 절댓값을 리턴하는 함수는?', ['abs', 'len', 'map']],
    [
      '파이썬에서 문자열로 구성된 표현식을 입력으로 받아 해당 문자열을 실행한 결괏값을 리턴하는 함수는?',
      ['eval', 'len', 'map'],
    ],
    ['파이썬에서 문자의 유니코드 숫자 값을 리턴하는 함수는?', ['ord', 'len', 'map']],
    [
      '파이썬에서 유니코드 숫자값을 입력받아 그 코드에 해당하는 문자를 리턴하는 함수는?',
      ['char', 'len', 'map'],
    ],
    [
      '파이썬에서 for문과 함께 자주 사용하는 함수로, 입력받은 숫자에 해당하는 범위 값을 반복 가능한 객체로 만들어 리턴하는 함수는?',
      ['range', 'len', 'map'],
    ],
  ]

  // 2. Bling the Text

  const bling = () => {
    setFlag((prevFlag) => (prevFlag + 1) % 4)
  }

  useEffect(() => {
    const intervalId = setInterval(bling, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    const colors = ['#d6806e', '#fbb666', '#f9f871', '#f2ecff']
    setTitleColor(colors[flag])
  }, [flag])

  // 3. Start Button Event

  // 친구가 들어왔는데 내가 방장이면, 시작 버튼이 보여야 함
  // 내가 방장이 아니면 시작 버튼 보이지 않음
  // 게임 시작 전에 누가 나가면 시작 버튼 숨겨야 함

  useEffect(() => {
    if (friendname) {
      if (host === username) {
        const startButton = document.getElementById('start-button-div')
        startButton.classList.remove('hidden')
      } else {
        const startButton = document.getElementById('start-button-div')
        startButton.classList.add('hidden')
      }

      // 친구가 들어오면 방장이 시작 버튼을 누를 수 있게 함
      setStartButton(true)

      setWinner('')
    } else {
      // 한 명이 되었으니 일단 게임 시작 못 함
      const startButton = document.getElementById('start-button-div')
      startButton.classList.add('hidden')

      // 친구가 나가면 방장은 버튼을 누를 수 없음
      setStartButton(false)

      if (host !== username) {
        // 내가 방장이 아닌데 상대방(방장)이 나갔다면, 이 방의 방장을 나로 업데이트
        bootstrap.gameNetwork.changeHost(username)
      }

      // 게임 도중에 한명이 나갔다면,
      if (startGame) {
        endGame()
        showWinner()

        setProblemText('정답을 말하고 있는 두더지를 잡아라!')

        setStartButton(false)

        const FinishAudio = new Audio(FinishBGM)
        FinishAudio.play()
      }
    }
  }, [friendname, host])

  // 방장만 들어올 수 있음
  const startMole = () => {
    // Request start game
    bootstrap.gameNetwork.startGame('0')
  }

  // 4. Show Event

  const randomHole = () => {
    let luckyMoles = []

    const makeNum = () => {
      function notSame(n) {
        return luckyMoles.every((e) => n !== e)
      }

      if (luckyMoles.length < 3) {
        let n = Math.floor(Math.random() * 9) + 1

        if (notSame(n)) {
          luckyMoles.push(n)
        }

        makeNum()
      }
    }
    makeNum()

    return luckyMoles
  }

  const moleActive = (num) => {
    num.classList.add('active')
  }

  const moleHide = () => {
    let mole1 = document.getElementById('1')
    let mole2 = document.getElementById('2')
    let mole3 = document.getElementById('3')
    let mole4 = document.getElementById('4')
    let mole5 = document.getElementById('5')
    let mole6 = document.getElementById('6')
    let mole7 = document.getElementById('7')
    let mole8 = document.getElementById('8')
    let mole9 = document.getElementById('9')

    if (mole1 !== null) mole1.classList.remove('active')
    if (mole2 !== null) mole2.classList.remove('active')
    if (mole3 !== null) mole3.classList.remove('active')
    if (mole4 !== null) mole4.classList.remove('active')
    if (mole5 !== null) mole5.classList.remove('active')
    if (mole6 !== null) mole6.classList.remove('active')
    if (mole7 !== null) mole7.classList.remove('active')
    if (mole8 !== null) mole8.classList.remove('active')
    if (mole9 !== null) mole9.classList.remove('active')

    setAnswerText1('')
    setAnswerText2('')
    setAnswerText3('')
    setAnswerText4('')
    setAnswerText5('')
    setAnswerText6('')
    setAnswerText7('')
    setAnswerText8('')
    setAnswerText9('')
  }

  const showingMole = () => {
    // 임시
    if (turn < 3) {
      let luckyMoles = randomHole()

      randomNumber1 = luckyMoles[0]
      randomNumber2 = luckyMoles[1]
      randomNumber3 = luckyMoles[2]

      moleNumber1 = document.getElementById(`${randomNumber1}`)
      moleNumber2 = document.getElementById(`${randomNumber2}`)
      moleNumber3 = document.getElementById(`${randomNumber3}`)

      switch (randomNumber1) {
        case 1:
          setAnswerText1(problems[turn][1][0])
          break

        case 2:
          setAnswerText2(problems[turn][1][0])
          break

        case 3:
          setAnswerText3(problems[turn][1][0])
          break

        case 4:
          setAnswerText4(problems[turn][1][0])
          break

        case 5:
          setAnswerText5(problems[turn][1][0])
          break

        case 6:
          setAnswerText6(problems[turn][1][0])
          break

        case 7:
          setAnswerText7(problems[turn][1][0])
          break

        case 8:
          setAnswerText8(problems[turn][1][0])
          break

        case 9:
          setAnswerText9(problems[turn][1][0])
          break
      }

      switch (randomNumber2) {
        case 1:
          setAnswerText1(problems[turn][1][1])
          break

        case 2:
          setAnswerText2(problems[turn][1][1])
          break

        case 3:
          setAnswerText3(problems[turn][1][1])
          break

        case 4:
          setAnswerText4(problems[turn][1][1])
          break

        case 5:
          setAnswerText5(problems[turn][1][1])
          break

        case 6:
          setAnswerText6(problems[turn][1][1])
          break

        case 7:
          setAnswerText7(problems[turn][1][1])
          break

        case 8:
          setAnswerText8(problems[turn][1][1])
          break

        case 9:
          setAnswerText9(problems[turn][1][1])
          break
      }

      switch (randomNumber3) {
        case 1:
          setAnswerText1(problems[turn][1][2])
          break

        case 2:
          setAnswerText2(problems[turn][1][2])
          break

        case 3:
          setAnswerText3(problems[turn][1][2])
          break

        case 4:
          setAnswerText4(problems[turn][1][2])
          break

        case 5:
          setAnswerText5(problems[turn][1][2])
          break

        case 6:
          setAnswerText6(problems[turn][1][2])
          break

        case 7:
          setAnswerText7(problems[turn][1][2])
          break

        case 8:
          setAnswerText8(problems[turn][1][2])
          break

        case 9:
          setAnswerText9(problems[turn][1][2])
          break
      }

      setCanClick(true)

      setProblemText(problems[turn][0])

      moleActive(moleNumber1)
      moleActive(moleNumber2)
      moleActive(moleNumber3)

      let timeoutId = setTimeout(seeMole, 5000)
      setMoleCatch(timeoutId)

      setActiveNumber(randomNumber1)
      setActiveNumberList([randomNumber1, randomNumber2, randomNumber3])

      setStartButton(false)
      setTurn(turn + 1)
    } else {
      endGame()
      showWinner()

      const FinishAudio = new Audio(FinishBGM)
      FinishAudio.play()

      setStartButtonText('PRESS AGAIN')
      setStartButtonColor('#f2ecff')
    }
  }

  // 5. Catch Mole Event

  const seeMole = () => {
    moleHide()

    clearTimeout(moleCatch)
    setTimeout(showingMole, 1000)
  }

  const catchMole = () => {
    seeMole()

    clearTimeout(moleCatch)
  }

  const handleClick = (num) => {
    if (!canClick) {
      return
    }

    if (!startGame) {
      return;
    }

    // Click Other
    if (!activeNumberList.includes(num)) {
      return
    } else {
      // Correct Answer
      if (activeNumber === num) {
        setCanClick(false)

        const CorrectAudio = new Audio(CorrectBGM)
        CorrectAudio.play()

        const getPoint = document.getElementById('point-current')
        getPoint.classList.add('get-point')

        // Point + 1
        setMyPoint(myPoint + 1)
        bootstrap.gameNetwork.sendMyPoint(myPoint.toString())

        setTimeout(function () {
          const removePoint = document.getElementById('point-current')
          removePoint.classList.remove('get-point')
        }, 1000)

        // Character Jump Event
        const myCharacter = document.getElementById('my-character')
        myCharacter.classList.add('jump-animation')

        setTimeout(function () {
          myCharacter.classList.remove('jump-animation')
        }, 1000)

        // Problem + 1
        bootstrap.gameNetwork.startGame(turn.toString())

        // Wrong Answer
      } else {
        const WrongAudio = new Audio(WrongBGM)
        WrongAudio.play()

        // Life - 1
        setMyLife(myLife - 1)
        bootstrap.gameNetwork.sendMyLife(myLife.toString())

        const number = document.getElementById(`${num}`)
        number.classList.add('click-wrong')

        setTimeout(function () {
          number.classList.remove('click-wrong')
        }, 1000)
      }
    }
  }

  // 7. Check the winner
  const showWinner = () => {
    // 1. 상대방이 있는지 확인
    if (friendname === '') {
      // 상대방이 나가면 게임 종료
      setProblemText('정답을 말하고 있는 두더지를 잡아라!')

      // 2. 친구 목숨, 내 목숨 확인
    } else if (friendLife === '0' || myLife === 0) {
      if (friendLife === '0') {
        setWinner(username)
      } else if (myLife === 0) {
        setWinner(friendname)
      }

      // 3. 게임이 끝까지 진행되어 종료
    } else {
      if (parseInt(friendPoint) > myPoint) {
        setWinner(friendname)
      } else if (parseInt(friendPoint) < myPoint) {
        setWinner(username)
      } else {
        setWinner('both')
      }
    }

    // 시작 버튼을 누를 수 있도록 수정
    setStartButton(true)
  }

  const handleMouseOver = () => {
    const ButtonAudio = new Audio(ButtonBGM)
    ButtonAudio.play()
  }

  // 8. Close

  const handleClose = () => {
    endGame()

    try {
      // 내 정보 초기화, 내가 방장이었다면 방장 이임
      bootstrap.gameNetwork.sendMyInfo('', '')

      bootstrap.gameNetwork.leaveGameRoom()

      dispatch(closeMoleGameDialog())
      dispatch(setDialogStatus(DIALOG_STATUS.IN_MAIN))
    } catch (error) {
      console.error('Error leaving the room:', error)
    }
  }

  // Clear the game
  const endGame = () => {
    moleHide()

    setTurn(0)
    setMyPoint(0)
    setMyLife(3)

    clearTimeout(moleCatch)
    setStartGame(false)

    // 1. 문제 Problem 초기화
    bootstrap.gameNetwork.startGame('-1')

    // 2. 점수 Point 초기화
    bootstrap.gameNetwork.sendMyPoint('-1')

    // 3. 목숨 Life 초기화
    bootstrap.gameNetwork.sendMyLife('4')

    // 4. 내가 다시 들어올 경우 대비, 상대편 정보 초기화
    bootstrap.gameNetwork.clearFriendInfo()
  }

  // 경험치 보내주기
  const gainExpUpdateLevel = (username: string, exp: number) => {
    const body: UpdateLevelReqest = {
      username: username,
      exp: exp,
    }
    updateLevel(body)
      .then((response) => {
        if (!response) return
      })
      .catch((error) => {
        if (error.response) {
          const { status, message } = error.response.data
        }
      })
  }

  useEffect(() => {
    if (winner == username) {
      gainExpUpdateLevel(username, 7)
    } else if (winner == friendname) {
      gainExpUpdateLevel(username, 3)
    }
    if (winner) {
      openModal()
    }
  }, [winner])

  // Change with problem
  useEffect(() => {
    if (problem === '' || problem === '0') {
      console.log('Wait for press start button')
    } else if (problem === '1') {
      // 현재 게임 진행중인지 아닌지를 판별
      setStartGame(true)
      setStartButtonColor('#3d3f43')

      setMyPoint(0)
      setMyLife(3)
      setTimeout(showingMole, 1000)
    } else {
      catchMole()
    }
  }, [problem])

  // Change with life
  useEffect(() => {
    if (friendLife === '0') {
      endGame()
      showWinner()

      setStartButton(true)

      const FinishAudio = new Audio(FinishBGM)
      FinishAudio.play()
    }
  }, [friendLife])

  useEffect(() => {
    if (myLife === 0) {
      endGame()
      showWinner()

      setStartButton(true)

      const FinishAudio = new Audio(FinishBGM)
      FinishAudio.play()
    }
  }, [myLife])

  return (
    <Backdrop>
      <Wrapper>
        <IconButton
          aria-label="close dialog"
          className="close"
          onClick={() => {
            handleClose()
          }}
        >
          <CloseIcon />
        </IconButton>

        <RoundArea>Round {turn}/3</RoundArea>

        <body>
          <Header>
            <div className="title" style={{ color: titleColor }}>
              Welcome! Whack-A-Mole
            </div>
          </Header>

          <Comment>
            <p className={`friend-comment ${friendname ? '' : 'start-game'}`}>
              {friendname ? '친구가 들어왔어요,' : '친구가 아직 들어오지 않았어요 !'}
              <br />
              {friendname ? '방장은 Start 버튼을 눌러주세요 !' : '친구가 들어와야 게임이 시작돼요.'}
            </p>
          </Comment>

          <div className="main">
            <Problem>
              <ProblemText>{problemText}</ProblemText>
            </Problem>

            <TipArea>
              틀린 답을 외치는 두더지를 잡으면 목숨이 깎여요!
              <br />
              💡 TIP: 두더지를 빨리 잡으려고 하는 것보다, 문제를 잘 읽고 푸는 게 더 중요할 거예요.
            </TipArea>

            <Content>
              <YourPoint>
                <IsWinner>
                  {friendname && !startGame && winner === friendname ? 'WINNER' : ''}
                  <br />
                  <br />
                </IsWinner>
                <IsHost>
                  {friendname && friendname === host ? '방장' : ''}
                  <br />
                  <br />
                </IsHost>
                <CharacterArea>
                  <img
                    src={friendimgpath}
                    width="50px"
                    id="friend-character"
                    className={friendname ? '' : 'hidden'}
                  ></img>
                </CharacterArea>
                <NameArea>
                  [{friendname.toUpperCase()}]<br />
                  <br />
                </NameArea>
                <LifeArea>{friendLifeElements}</LifeArea>
                <PointArea>
                  <span id="friend-point-current">{friendPoint ? friendPoint : '0'}</span>/10
                </PointArea>
              </YourPoint>

              <Moles>
                <ul className="whack-a-mole">
                  <li className="mole" onClick={() => handleClick(1)}>
                    <img id="1" src="/assets/game/molegame/mole.png"></img>
                    <div
                      id="answer-div-1"
                      className={`answer-text-1 ${activeNumberList.includes(1) ? '' : 'hidden'}`}
                    >
                      <p id="answer-text-1">{answerText1}</p>
                    </div>
                  </li>
                  <li className="mole" onClick={() => handleClick(2)}>
                    <img id="2" src="/assets/game/molegame/mole.png"></img>
                    <div
                      id="answer-div-2"
                      className={`answer-text-2 ${activeNumberList.includes(2) ? '' : 'hidden'}`}
                    >
                      <p id="answer-text-2">{answerText2}</p>
                    </div>
                  </li>
                  <li className="mole" onClick={() => handleClick(3)}>
                    <img id="3" src="/assets/game/molegame/mole.png"></img>
                    <div
                      id="answer-div-3"
                      className={`answer-text-3 ${activeNumberList.includes(3) ? '' : 'hidden'}`}
                    >
                      <p id="answer-text-3">{answerText3}</p>
                    </div>
                  </li>
                  <li className="mole" onClick={() => handleClick(4)}>
                    <img id="4" src="/assets/game/molegame/mole.png"></img>
                    <div
                      id="answer-div-4"
                      className={`answer-text-4 ${activeNumberList.includes(4) ? '' : 'hidden'}`}
                    >
                      <p id="answer-text-4">{answerText4}</p>
                    </div>
                  </li>
                  <li className="mole" onClick={() => handleClick(5)}>
                    <img id="5" src="/assets/game/molegame/mole.png"></img>
                    <div
                      id="answer-div-5"
                      className={`answer-text-5 ${activeNumberList.includes(5) ? '' : 'hidden'}`}
                    >
                      <p id="answer-text-5">{answerText5}</p>
                    </div>
                  </li>
                  <li className="mole" onClick={() => handleClick(6)}>
                    <img id="6" src="/assets/game/molegame/mole.png"></img>
                    <div
                      id="answer-div-6"
                      className={`answer-text-6 ${activeNumberList.includes(6) ? '' : 'hidden'}`}
                    >
                      <p id="answer-text-6">{answerText6}</p>
                    </div>
                  </li>
                  <li className="mole" onClick={() => handleClick(7)}>
                    <img id="7" src="/assets/game/molegame/mole.png"></img>
                    <div
                      id="answer-div-7"
                      className={`answer-text-7 ${activeNumberList.includes(7) ? '' : 'hidden'}`}
                    >
                      <p id="answer-text-7">{answerText7}</p>
                    </div>
                  </li>
                  <li className="mole" onClick={() => handleClick(8)}>
                    <img id="8" src="/assets/game/molegame/mole.png"></img>
                    <div
                      id="answer-div-8"
                      className={`answer-text-8 ${activeNumberList.includes(8) ? '' : 'hidden'}`}
                    >
                      <p id="answer-text-8">{answerText8}</p>
                    </div>
                  </li>
                  <li className="mole" onClick={() => handleClick(9)}>
                    <img id="9" src="/assets/game/molegame/mole.png"></img>
                    <div
                      id="answer-div-9"
                      className={`answer-text-9 ${activeNumberList.includes(9) ? '' : 'hidden'}`}
                    >
                      <p id="answer-text-9">{answerText9}</p>
                    </div>
                  </li>
                </ul>
              </Moles>

              <MyPoint>
                <IsWinner>
                  {winner === username && !startGame ? 'WINNER' : ''}
                  <br />
                  <br />
                </IsWinner>

                {isModalOpen && (
                  <ExperienceResultModal open={isModalOpen} handleClose={closeModal} />
                )}

                <IsHost>
                  {friendname && username === host ? '방장' : ''}
                  <br />
                  <br />
                </IsHost>
                <CharacterArea>
                  <img src={imgpath} width="50px" id="my-character"></img>
                </CharacterArea>
                <NameArea>
                  [{username.toUpperCase()}]<br />
                  <br />
                </NameArea>
                <LifeArea>{myLifeElements}</LifeArea>
                <PointArea>
                  <span id="point-current">{myPoint}</span>/10
                </PointArea>
              </MyPoint>
            </Content>

            <div id="start-button-div" className="point-box clearfix hidden">
              <div className="btn-wrap">
                <button
                  type="button"
                  className="start-btn"
                  style={{ color: startButtonColor }}
                  disabled={!startButton}
                  onClick={startButton ? () => startMole() : null}
                  onMouseEnter={handleMouseOver}
                >
                  {startButtonText}
                </button>
              </div>
            </div>
          </div>
        </body>
      </Wrapper>
    </Backdrop>
  )
}