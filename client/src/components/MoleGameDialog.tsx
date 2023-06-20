import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

import { useAppSelector, useAppDispatch } from '../hooks'
import { closeMoleGameDialog } from '../stores/MoleGameStore'

import ButtonBGM from '/assets/audios/mole_button.mp3';
import CorrectBGM from '/assets/audios/mole_correct.mp3';
import WrongBGM from '/assets/audios/mole_wrong.mp3';
import FinishBGM from '/assets/audios/mole_finish.mp3';

import './MoleGame.css'

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
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
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 5px #0000006f;

  .close {
    position: absolute;
    top: 0px;
    right: 0px;
  }

  .music {
    position: absolute;
    top: 0px;
    left: 0px;
  }
`

const ProblemText = styled.div`
  font-family: Font_DungGeun;
  font-size: 15px;
`

export default function MoleGameDialog() {
  const dispatch = useAppDispatch()

  const [flag, setFlag] = useState(0);
  const [titleColor, setTitleColor] = useState('#f2ecff');

  const [problemText, setProblemText] = useState("정답을 말하고 있는 두더지를 잡아라!");
  const [answerText1, setAnswerText1] = useState(String);
  const [answerText2, setAnswerText2] = useState(String);
  const [answerText3, setAnswerText3] = useState(String);
  const [answerText4, setAnswerText4] = useState(String);
  const [answerText5, setAnswerText5] = useState(String);
  const [answerText6, setAnswerText6] = useState(String);
  const [answerText7, setAnswerText7] = useState(String);
  const [answerText8, setAnswerText8] = useState(String);
  const [answerText9, setAnswerText9] = useState(String);

  const [startButtonColor, setStartButtonColor] = useState('');
  const [startButtonText, setStartButtonText] = useState('PRESS START');

  const [activeNumber, setActiveNumber] = useState(0);
  const [activeNumberList, setActiveNumberList] = useState([0, 0, 0]);

  const [disableStartButton, setDisableStartButton] = React.useState(false);
  const [hideEnding, setHideEnding] = React.useState(true);
  
  const [point, setPoint] = useState(0);
  const [turn, setTurn] = useState(0);
  
  const [moleCatch, setMoleCatch] = useState(0);

  let randomNumber1 = 0;
  let randomNumber2 = 0;
  let randomNumber3 = 0;

  let moleNumber1 = 0;
  let moleNumber2 = 0;
  let moleNumber3 = 0;

  // 0. Bling the Text

  const bling = () => {
    setFlag((prevFlag) => (prevFlag + 1) % 4);
  };

  useEffect(() => {
    const intervalId = setInterval(bling, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const colors = ['#d6806e', '#fbb666', '#f9f871', '#f2ecff'];
    setTitleColor(colors[flag]);
  }, [flag]);

  // 1. Start Button Event

  const startMole = () => {
    console.log("Function [startMole]");

    setStartButtonColor('#3d3f43');
    setPoint(0);

    setTimeout(showingMole, 1000);
  }

  // 2. Show Event

  var after = [
    ['Q01. 파이썬에서 리스트에 들어있는 모든 수를 합하는 함수는?', ['sum', 'len', 'map', 'list']],
    ['Q02. 파이썬에서 리스트의 개수를 구하는 함수는?', ['len', 'abs', 'map', 'list']],
    ['Q03. 파이썬에서 새로운 정렬된 리스트를 반환하는 함수는?', ['sorted', 'len', 'map', 'list']],
    ['Q04. 파이썬에서 리스트 자체를 정렬시켜버리는 것은?', ['sort', 'len', 'map', 'list']],
    ['Q05. 파이썬에서 내림차순 정렬을 위해 사용하는 옵션은?', ['reverse', 'len', 'map', 'list']],
    ['Q06. 파이썬에서 숫자의 절댓값을 리턴하는 함수는?', ['abs', 'len', 'map', 'list']],
    ['Q07. 파이썬에서 문자열로 구성된 표현식을 입력으로 받아 해당 문자열을 실행한 결괏값을 리턴하는 함수는?', ['eval', 'len', 'map', 'list']],
    ['Q08. 파이썬에서 문자의 유니코드 숫자 값을 리턴하는 함수는?', ['ord', 'len', 'map', 'list']],
    ['Q09. 파이썬에서 유니코드 숫자값을 입력받아 그 코드에 해당하는 문자를 리턴하는 함수는?', ['char', 'len', 'map', 'list']],
    ['Q10. 파이썬에서 for문과 함께 자주 사용하는 함수로, 입력받은 숫자에 해당하는 범위 값을 반복 가능한 객체로 만들어 리턴하는 함수는?', ['range', 'len', 'map', 'list']]  
  ];

  const randomHole = () => {
    console.log("Function [randomHole]");

    let luckyMoles = [];

    const makeNum = () => {
      function notSame (n) {
        return luckyMoles.every((e) => n !== e);
      }

      if (luckyMoles.length < 3) {
        let n = Math.floor(Math.random() * 9) + 1;

        if (notSame(n)) {
          luckyMoles.push(n);
        }

        makeNum();
      }
    }
    makeNum();

    return luckyMoles;
  }

  const moleActive = (num) => {
    console.log("Function [moleActive]");
    
    num.classList.add('active');
  }

  const moleHide = () => {
    console.log("Function [moleHide]");

    let mole1 = document.getElementById('1');
    let mole2 = document.getElementById('2');
    let mole3 = document.getElementById('3');
    let mole4 = document.getElementById('4');
    let mole5 = document.getElementById('5');
    let mole6 = document.getElementById('6');
    let mole7 = document.getElementById('7');
    let mole8 = document.getElementById('8');
    let mole9 = document.getElementById('9');
    
    if (mole1 !== null) mole1.classList.remove('active');
    if (mole2 !== null) mole2.classList.remove('active');
    if (mole3 !== null) mole3.classList.remove('active');
    if (mole4 !== null) mole4.classList.remove('active');
    if (mole5 !== null) mole5.classList.remove('active');
    if (mole6 !== null) mole6.classList.remove('active');
    if (mole7 !== null) mole7.classList.remove('active');
    if (mole8 !== null) mole8.classList.remove('active');
    if (mole9 !== null) mole9.classList.remove('active');

    setAnswerText1('');
    setAnswerText2('');
    setAnswerText3('');
    setAnswerText4('');
    setAnswerText5('');
    setAnswerText6('');
    setAnswerText7('');
    setAnswerText8('');
    setAnswerText9('');
  }

  const showingMole = () => {
    console.log("Function [showingMole]");

    console.log(turn);
    
    if (turn < 10) {
      let luckyMoles = randomHole();

      randomNumber1 = luckyMoles[0];
      randomNumber2 = luckyMoles[1];
      randomNumber3 = luckyMoles[2];

      moleNumber1 = document.getElementById(`${randomNumber1}`);
      moleNumber2 = document.getElementById(`${randomNumber2}`);
      moleNumber3 = document.getElementById(`${randomNumber3}`);

      switch(randomNumber1) {
        case 1:
          setAnswerText1(after[turn][1][0]);
          break;

        case 2:
          setAnswerText2(after[turn][1][0]);
          break;

        case 3:
          setAnswerText3(after[turn][1][0]);
          break;

        case 4:
          setAnswerText4(after[turn][1][0]);
          break;

        case 5:
          setAnswerText5(after[turn][1][0]);
          break;

        case 6:
          setAnswerText6(after[turn][1][0]);
          break;

        case 7:
          setAnswerText7(after[turn][1][0]);
          break;

        case 8:
          setAnswerText8(after[turn][1][0]);
          break;

        case 9:
          setAnswerText9(after[turn][1][0]);
          break;
      }

      switch(randomNumber2) {
        case 1:
          setAnswerText1(after[turn][1][1]);
          break;

        case 2:
          setAnswerText2(after[turn][1][1]);
          break;

        case 3:
          setAnswerText3(after[turn][1][1]);
          break;

        case 4:
          setAnswerText4(after[turn][1][1]);
          break;

        case 5:
          setAnswerText5(after[turn][1][1]);
          break;

        case 6:
          setAnswerText6(after[turn][1][1]);
          break;

        case 7:
          setAnswerText7(after[turn][1][1]);
          break;

        case 8:
          setAnswerText8(after[turn][1][1]);
          break;

        case 9:
          setAnswerText9(after[turn][1][1]);
          break;
      }

      switch(randomNumber3) {
        case 1:
          setAnswerText1(after[turn][1][2]);
          break;

        case 2:
          setAnswerText2(after[turn][1][2]);
          break;

        case 3:
          setAnswerText3(after[turn][1][2]);
          break;

        case 4:
          setAnswerText4(after[turn][1][2]);
          break;

        case 5:
          setAnswerText5(after[turn][1][2]);
          break;

        case 6:
          setAnswerText6(after[turn][1][2]);
          break;

        case 7:
          setAnswerText7(after[turn][1][2]);
          break;

        case 8:
          setAnswerText8(after[turn][1][2]);
          break;

        case 9:
          setAnswerText9(after[turn][1][2]);
          break;
      }

      setProblemText(after[turn][0]);

      moleActive(moleNumber1);
      moleActive(moleNumber2);
      moleActive(moleNumber3);

      const timeoutId = setTimeout(seeMole, 5000);
      setMoleCatch(timeoutId);

      setActiveNumber(randomNumber1);
      setActiveNumberList([randomNumber1, randomNumber2, randomNumber3]);

      setDisableStartButton(true);

      setTurn(turn + 1);

    } else {
      modalEvent();
      
      setTurn(0);
      
      setHideEnding(false);

      const FinishAudio = new Audio(FinishBGM);
      FinishAudio.play();

      setStartButtonText('PRESS AGAIN');
      setStartButtonColor('#f2ecff');

      setDisableStartButton(false);
    }
  }

  // 3. Catch Mole Event

  const seeMole = () => {
    console.log("Function [seeMole]");

    moleHide();
    
    clearTimeout(moleCatch);
    
    setTimeout(showingMole, 1000);
  }

  const catchMole = () => {
    console.log("Function [catchMole]");
    
    seeMole();

    clearTimeout(moleCatch);
  }

  const handleClick = (num) => {
    console.log("Function [handleClick]");

    // Click Other
    if (!activeNumberList.includes(num)) {
      return;

    } else {
      // Correct Answer
      if (activeNumber === num) {
        const CorrectAudio = new Audio(CorrectBGM);
        CorrectAudio.play();

        const getPoint = document.getElementById('point-current');
        getPoint.classList.add('get-point');

        setPoint(point + 1);

        setTimeout(function() {
          const removePoint = document.getElementById('point-current');
          removePoint.classList.remove('get-point');
        }, 1000);

        const number = document.getElementById(`${num}`);
        number.classList.add('click-correct');
  
        setTimeout(function() {
          number.classList.remove('click-correct');
        }, 1000);

      // Wrong Answer
      } else {
        const WrongAudio = new Audio(WrongBGM);
        WrongAudio.play();

        const number = document.getElementById(`${num}`);
        number.classList.add('click-wrong');

        setTimeout(function() {
          number.classList.remove('click-wrong');
        }, 1000);
      }

      catchMole();
    }
  };

  // 4. Score Modal

  let total = (point / 10) * 100;

  const modalEvent = () => {
    setHideEnding(true);
    setDisableStartButton(true);
  }

  const hideModal = () => {
    setHideEnding(true);
    setDisableStartButton(false);
  }

  const Modal = () => {
    return(
      <div id="ending" className="ending finalEnding">
        <p id="ending-box">
          <span>
            GAME OVER!<br/><br/>
            YOUR SCORE IS&nbsp;
          </span>
          <span className='last'>{ total }</span>
          <p></p>

          <div className="btn-wrap">
            <button type="button" 
                    className="restart-btn" 
                    style={{ color: "#f9f871" }}
                    onClick={() => hideModal()}
                    onMouseEnter={ handleMouseOver }>
              CLOSE
            </button>
          </div>
        </p>
      </div>
    )
  }

  const handleMouseOver = () => {
    const ButtonAudio = new Audio(ButtonBGM);
    ButtonAudio.play();
  }

  // 6. Close

  const handleClose = () => {
    dispatch(closeMoleGameDialog());
  }
  
  return (
    <Backdrop>
      <Wrapper>
        <IconButton
          aria-label="close dialog"
          className="close"
          onClick={ handleClose }
        >
          <CloseIcon />
        </IconButton>

        {
          hideEnding === false ? <Modal /> : ''
        }

        <body>
          <header>
              <h1 className="title" style={{ color:titleColor }}>Welcome!<br/>whack-a-mole</h1> 
          </header>

          <div className="main">
            <div id="problem" className="problem">
              <ProblemText>
                <p id="problem-box">{ problemText }</p>
              </ProblemText>
            </div>
            
            <ul className="whack-a-mole clearfix">
              <li className="mole" onClick={() => handleClick(7)}>
                <img id="7" src="/assets/game/molegame/mole.png"></img>
                <div id="answer-div-7" className={`answer-text-7 ${activeNumberList.includes(7) ? '' : 'hiding'}`}>
                  <p id="answer-text-7">{ answerText7 }</p>
                </div>
              </li>
              <li className="mole" onClick={() => handleClick(8)}>
                <img id="8" src="/assets/game/molegame/mole.png"></img>
                <div id="answer-div-8" className={`answer-text-8 ${activeNumberList.includes(8) ? '' : 'hiding'}`}>
                  <p id="answer-text-8">{ answerText8 }</p>
                </div>
              </li>
              <li className="mole" onClick={() => handleClick(9)}>
                <img id="9" src="/assets/game/molegame/mole.png"></img>
                <div id="answer-div-9" className={`answer-text-9 ${activeNumberList.includes(9) ? '' : 'hiding'}`}>
                  <p id="answer-text-9">{ answerText9 }</p>
                </div>
              </li>
              <li className="mole" onClick={() => handleClick(4)}>
                <img id="4" src="/assets/game/molegame/mole.png"></img>
                <div id="answer-div-4" className={`answer-text-4 ${activeNumberList.includes(4) ? '' : 'hiding'}`}>
                  <p id="answer-text-4">{ answerText4 }</p>
                </div>
              </li>
              <li className="mole" onClick={() => handleClick(5)}>
                <img id="5" src="/assets/game/molegame/mole.png"></img>
                <div id="answer-div-5" className={`answer-text-5 ${activeNumberList.includes(5) ? '' : 'hiding'}`}>
                  <p id="answer-text-5">{ answerText5 }</p>
                </div>
              </li>
              <li className="mole" onClick={() => handleClick(6)}>
                <img id="6" src="/assets/game/molegame/mole.png"></img>
                <div id="answer-div-6" className={`answer-text-6 ${activeNumberList.includes(6) ? '' : 'hiding'}`}>
                  <p id="answer-text-6">{ answerText6 }</p>
                </div>
              </li>
              <li className="mole" onClick={() => handleClick(1)}>
                <img id="1" src="/assets/game/molegame/mole.png"></img>
                <div id="answer-div-1" className={`answer-text-1 ${activeNumberList.includes(1) ? '' : 'hiding'}`}>
                  <p id="answer-text-1">{ answerText1 }</p>
                </div>
              </li>
              <li className="mole" onClick={() => handleClick(2)}>
                <img id="2" src="/assets/game/molegame/mole.png"></img>
                <div id="answer-div-2" className={`answer-text-2 ${activeNumberList.includes(2) ? '' : 'hiding'}`}>
                  <p id="answer-text-2">{ answerText2 }</p>
                </div>
              </li>
              <li className="mole" onClick={() => handleClick(3)}>
                <img id="3" src="/assets/game/molegame/mole.png"></img>
                <div id="answer-div-3" className={`answer-text-3 ${activeNumberList.includes(3) ? '' : 'hiding'}`}>
                  <p id="answer-text-3">{ answerText3 }</p>
                </div>
              </li>
            </ul>

            <div className="point-box clearfix">
              <div className="point-wrap">
                <p id="point-text">Point : <span id="point-current">{ point }</span>/10</p>
              </div>

              <div className="btn-wrap">
                <button type="button" 
                        className="start-btn" 
                        style={{ color: startButtonColor }} 
                        disabled={ disableStartButton } 
                        onClick={() => startMole()}
                        onMouseEnter={ handleMouseOver }>
                  { startButtonText }
                </button>
              </div>
            </div>
          </div>
        </body>
      </Wrapper>
    </Backdrop>
  )
}