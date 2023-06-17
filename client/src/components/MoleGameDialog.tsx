import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

import { useAppSelector, useAppDispatch } from '../hooks'
import { closeMoleGameDialog } from '../stores/MoleGameStore'

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
`

const ProblemText = styled.div`
  font-family: Font_DungGeun;
  font-size: 15px;
`

export default function MoleGameDialog() {
  const dispatch = useAppDispatch()

  const [flag, setFlag] = useState(0);
  const [titleColor, setTitleColor] = useState('#f2ecff');

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

  const [problemText, setProblemText] = useState("정답을 말하고 있는 두더지를 잡아줘!");

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

  let point = 0;
  let turn = 0;

  const startMole = () => {
    console.log("Function [startMole]");

    setStartButtonColor('#3d3f43');
    point = 0;
    turn = 0;

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

  const moleHide = (num) => {
    console.log("Function [moleHide]");
    
    num.classList.remove('active');

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
  
  let moleCatch;

  let randomNumber1;
  let randomNumber2;
  let randomNumber3;

  let moleNumber1;
  let moleNumber2;
  let moleNumber3;

  const [activeNumber, setActiveNumber] = useState(0);

  const [activeNumberList, setActiveNumberList] = useState([0, 0, 0]);

  const [disableStartButton, setDisableStartButton] = React.useState(false);
  const [hideEnding, setHideEnding] = React.useState(true);
  
  let luckyMoles = [];

  const showingMole = () => {
    console.log("Function [showingMole]");
    
    if (turn < 10) {
      luckyMoles = randomHole();

      randomNumber1 = luckyMoles[0];
      randomNumber2 = luckyMoles[1];
      randomNumber3 = luckyMoles[2];

      moleNumber1 = document.getElementById(`${randomNumber1}`);
      moleNumber2 = document.getElementById(`${randomNumber2}`);
      moleNumber3 = document.getElementById(`${randomNumber3}`);

      setProblemText(after[turn][0]);

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

      moleActive(moleNumber1);
      moleActive(moleNumber2);
      moleActive(moleNumber3);

      moleCatch = setTimeout(seeMole, 2000);
      turn++;

      setActiveNumber(randomNumber1);

      setActiveNumberList([randomNumber1, randomNumber2, randomNumber3]);

      setDisableStartButton(true);

    } else {
      modalEvent();

      setHideEnding(false);

      setStartButtonText('PRESS AGAIN');
      setStartButtonColor('#f2ecff');
      setDisableStartButton(false);
    }
  }

  // 3. Catch Mole Event

  const seeMole = () => {
    console.log("Function [seeMole]");

    moleHide(moleNumber1);
    moleHide(moleNumber2);
    moleHide(moleNumber3);
    
    clearTimeout(moleCatch);
    setTimeout(showingMole, 1000);
  }

  const catchMole = () => {
    console.log("Function [catchMole]");
    
    seeMole();
    clearTimeout(moleCatch);

    point++;
  }

  const handleClick = (num) => {
    console.log("Function [handleClick]");

    if (activeNumber === num) {
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
                    onClick={() => hideModal()}>
              CLOSE
            </button>
          </div>
        </p>
      </div>
    )
  }
  
  return (
    <Backdrop>
      <Wrapper>
        <IconButton
          aria-label="close dialog"
          className="close"
          onClick={() => dispatch(closeMoleGameDialog())}
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
              <li className="mole">
                <img id="7" src="/assets/game/molegame/mole.png" onClick={() => handleClick(7)}></img>
                <div id="answer-div-7" className={`answer-text-7 ${activeNumberList.includes(7) ? '' : 'hiding'}`}>
                  <p id="answer-text-7">{ answerText7 }</p>
                </div>
              </li>
              <li className="mole">
                <img id="8" src="/assets/game/molegame/mole.png" onClick={() => handleClick(8)}></img>
                <div id="answer-div-8" className={`answer-text-8 ${activeNumberList.includes(8) ? '' : 'hiding'}`}>
                  <p id="answer-text-8">{ answerText8 }</p>
                </div>
              </li>
              <li className="mole">
                <img id="9" src="/assets/game/molegame/mole.png" onClick={() => handleClick(9)}></img>
                <div id="answer-div-9" className={`answer-text-9 ${activeNumberList.includes(9) ? '' : 'hiding'}`}>
                  <p id="answer-text-9">{ answerText9 }</p>
                </div>
              </li>
              <li className="mole">
                <img id="4" src="/assets/game/molegame/mole.png" onClick={() => handleClick(4)}></img>
                <div id="answer-div-4" className={`answer-text-4 ${activeNumberList.includes(4) ? '' : 'hiding'}`}>
                  <p id="answer-text-4">{ answerText4 }</p>
                </div>
              </li>
              <li className="mole">
                <img id="5" src="/assets/game/molegame/mole.png" onClick={() => handleClick(5)}></img>
                <div id="answer-div-5" className={`answer-text-5 ${activeNumberList.includes(5) ? '' : 'hiding'}`}>
                  <p id="answer-text-5">{ answerText5 }</p>
                </div>
              </li>
              <li className="mole">
                <img id="6" src="/assets/game/molegame/mole.png" onClick={() => handleClick(6)}></img>
                <div id="answer-div-6" className={`answer-text-6 ${activeNumberList.includes(6) ? '' : 'hiding'}`}>
                  <p id="answer-text-6">{ answerText6 }</p>
                </div>
              </li>
              <li className="mole">
                <img id="1" src="/assets/game/molegame/mole.png" onClick={() => handleClick(1)}></img>
                <div id="answer-div-1" className={`answer-text-1 ${activeNumberList.includes(1) ? '' : 'hiding'}`}>
                  <p id="answer-text-1">{ answerText1 }</p>
                </div>
              </li>
              <li className="mole">
                <img id="2" src="/assets/game/molegame/mole.png" onClick={() => handleClick(2)}></img>
                <div id="answer-div-2" className={`answer-text-2 ${activeNumberList.includes(2) ? '' : 'hiding'}`}>
                  <p id="answer-text-2">{ answerText2 }</p>
                </div>
              </li>
              <li className="mole">
                <img id="3" src="/assets/game/molegame/mole.png" onClick={() => handleClick(3)}></img>
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
                        onClick={() => startMole()}>
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