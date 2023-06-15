import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

import { useAppSelector, useAppDispatch } from '../hooks'
import { closeCodeEditorDialog } from '../stores/CodeEditorStore'

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

export default function CodeEditorDialog() {
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
  const [answerText, setAnswerText] = useState(String);

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
    
    return Math.floor(Math.random() * 9) + 1;
  };

  const moleActive = (num) => {
    console.log("Function [moleActive]");
    
    num.classList.add('active');
  }

  const moleHide = (num) => {
    console.log("Function [moleHide]");
    
    num.classList.remove('active');
    setAnswerText('');
  }
  
  let randomNumber;
  let moleNumber;
  let moleCatch;

  const [activeNumber, setActiveNumber] = useState(0);
  const [disableStartButton, setDisableStartButton] = React.useState(false);

  const [hideEnding, setHideEnding] = React.useState(true);

  const showingMole = () => {
    console.log("Function [showingMole]");
    
    if (turn < 10) {
      randomNumber = randomHole();
      moleNumber = document.getElementById(`${randomNumber}`);

      setProblemText(after[turn][0]);
      setAnswerText(after[turn][1][0]);

      moleActive(moleNumber);

      moleCatch = setTimeout(seeMole, 2000);
      turn++;

      setActiveNumber(randomNumber);
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

    moleHide(moleNumber);
    
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

    startMole();
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

          <div className="btn-wrap">
            <button type="button" 
                    className="restart-btn" 
                    style={{ color: "#f9f871" }}
                    onClick={() => hideModal()}>
              RESTART
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
          onClick={() => dispatch(closeCodeEditorDialog())}
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
                <div id="answer-div-7" className={`answer-text-7 ${activeNumber === 7 ? '' : 'hiding'}`}>
                  <p id="answer-text-7">{ answerText }</p>
                </div>
              </li>
              <li className="mole">
                <img id="8" src="/assets/game/molegame/mole.png" onClick={() => handleClick(8)}></img>
                <div id="answer-div-8" className={`answer-text-8 ${activeNumber === 8 ? '' : 'hiding'}`}>
                  <p id="answer-text-8">{ answerText }</p>
                </div>
              </li>
              <li className="mole">
                <img id="9" src="/assets/game/molegame/mole.png" onClick={() => handleClick(9)}></img>
                <div id="answer-div-9" className={`answer-text-9 ${activeNumber === 9 ? '' : 'hiding'}`}>
                  <p id="answer-text-9">{ answerText }</p>
                </div>
              </li>
              <li className="mole">
                <img id="4" src="/assets/game/molegame/mole.png" onClick={() => handleClick(4)}></img>
                <div id="answer-div-4" className={`answer-text-4 ${activeNumber === 4 ? '' : 'hiding'}`}>
                  <p id="answer-text-4">{ answerText }</p>
                </div>
              </li>
              <li className="mole">
                <img id="5" src="/assets/game/molegame/mole.png" onClick={() => handleClick(5)}></img>
                <div id="answer-div-5" className={`answer-text-5 ${activeNumber === 5 ? '' : 'hiding'}`}>
                  <p id="answer-text-5">{ answerText }</p>
                </div>
              </li>
              <li className="mole">
                <img id="6" src="/assets/game/molegame/mole.png" onClick={() => handleClick(6)}></img>
                <div id="answer-div-6" className={`answer-text-6 ${activeNumber === 6 ? '' : 'hiding'}`}>
                  <p id="answer-text-6">{ answerText }</p>
                </div>
              </li>
              <li className="mole">
                <img id="1" src="/assets/game/molegame/mole.png" onClick={() => handleClick(1)}></img>
                <div id="answer-div-1" className={`answer-text-1 ${activeNumber === 1 ? '' : 'hiding'}`}>
                  <p id="answer-text-1">{ answerText }</p>
                </div>
              </li>
              <li className="mole">
                <img id="2" src="/assets/game/molegame/mole.png" onClick={() => handleClick(2)}></img>
                <div id="answer-div-2" className={`answer-text-2 ${activeNumber === 2 ? '' : 'hiding'}`}>
                  <p id="answer-text-2">{ answerText }</p>
                </div>
              </li>
              <li className="mole">
                <img id="3" src="/assets/game/molegame/mole.png" onClick={() => handleClick(3)}></img>
                <div id="answer-div-3" className={`answer-text-3 ${activeNumber === 3 ? '' : 'hiding'}`}>
                  <p id="answer-text-3">{ answerText }</p>
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