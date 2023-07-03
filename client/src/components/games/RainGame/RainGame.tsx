import React, { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import Bootstrap from '../../../scenes/Bootstrap'
import phaserGame from '../../../PhaserGame'
import { setRainGameMyState, setRainGameYouState} from '../../../stores/RainGameStore'

import TextField from '@mui/material/TextField'

import { 
  CharacterArea, NameArea, Position, 
  TimerArea, GameArea, Left, Right, PointArea, FriendPoint, MyPoint, InputArea,
} from './RainGameStyle'

import eraser from '/assets/game/RainGame/eraser.png'

interface KeywordRain {
  y: number
  speed: number
  keyword: string
  x: number
  // flicker: boolean,
  // blind: boolean,
  // accel: boolean,
  // multifly: boolean,
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function RainGame() {
  const dispatch = useAppDispatch()
  const keywordInput = useRef<HTMLInputElement>(null)
  const canvasHeight = 1000
  const lineHeight = canvasHeight - 500
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
  const [time, setTime] = useState(100)
  const [point, setPoint] = useState<number>(0)
  const host = useAppSelector((state) => state.raingame.host)

  // My information
  const username = useAppSelector((state) => state.user.username)
  const character = useAppSelector((state) => state.user.character)
  const imgpath = `/assets/character/single/${capitalizeFirstLetter(character)}_idle_anim_19.png`;
  
  // Friend information
  const you = useAppSelector((state) => state.raingame.you)
  const friendimgpath = `/assets/character/single/${capitalizeFirstLetter(you.character)}_idle_anim_19.png`;

  const [myGame, setMyGame] = useState<KeywordRain[]>([])
  const [youGame, setYouGame] = useState<KeywordRain[]>([])
  const myState = useAppSelector((state) => state.raingame.myState)
  const youState = useAppSelector((state) => state.raingame.youState)
  const me = useAppSelector((state) => state.raingame.me)

  const Awords = [
    { y: 0, speed: 1, keyword: 'abs', x: 331 },
    { y: 0, speed: 1.5, keyword: 'print', x: 253 },
    { y: 0, speed: 1, keyword: 'list', x: 182 },
    { y: 0, speed: 1.5, keyword: 'row', x: 413 },
    { y: 0, speed: 1, keyword: 'col', x: 395 },
    { y: 0, speed: 1.5, keyword: 'set', x: 267 },
    { y: 0, speed: 1, keyword: 'style', x: 149 },
    { y: 0, speed: 1.5, keyword: 'font', x: 347 },
    { y: 0, speed: 1, keyword: 'div', x: 278 },
    { y: 0, speed: 1.5, keyword: 'h1', x: 221 },
    { y: 0, speed: 1, keyword: 'h2', x: 443 },
    { y: 0, speed: 1.5, keyword: 'body', x: 381 },
    { y: 0, speed: 1, keyword: 'apple', x: 399 },
    { y: 0, speed: 1.5, keyword: 'banana', x: 273 },
    { y: 0, speed: 1, keyword: 'car', x: 331 },
    { y: 0, speed: 1.5, keyword: 'dog', x: 253 },
    { y: 0, speed: 1, keyword: 'elephant', x: 182 },
    { y: 0, speed: 1.5, keyword: 'flower', x: 413 },
    { y: 0, speed: 1, keyword: 'guitar', x: 395 },
    { y: 0, speed: 1.5, keyword: 'house', x: 267 },
    { y: 0, speed: 1, keyword: 'ice cream', x: 149 },
    { y: 0, speed: 1.5, keyword: 'jungle', x: 347 },
    { y: 0, speed: 1, keyword: 'kangaroo', x: 278 },
    { y: 0, speed: 1.5, keyword: 'lion', x: 221 },
    { y: 0, speed: 1, keyword: 'monkey', x: 443 },
    { y: 0, speed: 1.5, keyword: 'notebook', x: 381 },
    { y: 0, speed: 1, keyword: 'orange', x: 399 },
    { y: 0, speed: 1.5, keyword: 'piano', x: 273 },
    { y: 0, speed: 1, keyword: 'queen', x: 331 },
    { y: 0, speed: 1.5, keyword: 'rabbit', x: 253 },
  ]
  const Bwords = [
    { y: 0, speed: 1.2, keyword: 'zebra', x: 467 },
    { y: 0, speed: 1.4, keyword: 'umbrella', x: 174 },
    { y: 0, speed: 1.3, keyword: 'table', x: 290 },
    { y: 0, speed: 1.1, keyword: 'snake', x: 485 },
    { y: 0, speed: 1.5, keyword: 'rocket', x: 310 },
    { y: 0, speed: 1.4, keyword: 'pizza', x: 450 },
    { y: 0, speed: 1.2, keyword: 'ocean', x: 200 },
    { y: 0, speed: 1.3, keyword: 'moon', x: 388 },
    { y: 0, speed: 1.1, keyword: 'laptop', x: 333 },
    { y: 0, speed: 1.5, keyword: 'kiwi', x: 223 },
    { y: 0, speed: 1.2, keyword: 'island', x: 411 },
    { y: 0, speed: 1.3, keyword: 'hat', x: 274 },
    { y: 0, speed: 1.4, keyword: 'grape', x: 492 },
    { y: 0, speed: 1.2, keyword: 'forest', x: 267 },
    { y: 0, speed: 1.1, keyword: 'eagle', x: 300 },
    { y: 0, speed: 1.5, keyword: 'drum', x: 475 },
    { y: 0, speed: 1.3, keyword: 'chocolate', x: 230 },
    { y: 0, speed: 1.4, keyword: 'book', x: 365 },
    { y: 0, speed: 1.2, keyword: 'ant', x: 415 },
    { y: 0, speed: 1.1, keyword: 'window', x: 320 },
    { y: 0, speed: 1.5, keyword: 'television', x: 470 },
    { y: 0, speed: 1.2, keyword: 'sun', x: 190 },
    { y: 0, speed: 1.3, keyword: 'rain', x: 422 },
    { y: 0, speed: 1.4, keyword: 'penguin', x: 237 },
    { y: 0, speed: 1.1, keyword: 'otter', x: 393 },
    { y: 0, speed: 1.5, keyword: 'night', x: 255 },
    { y: 0, speed: 1.3, keyword: 'mountain', x: 288 },
    { y: 0, speed: 1.2, keyword: 'light', x: 444 },
    { y: 0, speed: 1.4, keyword: 'kite', x: 317 },
    { y: 0, speed: 1.5, keyword: 'jazz', x: 217 },
  ]
  if (username === host) {
  }

  useEffect(() => {
    let currentWordIndex = 0
    const words = username === host ? Awords : Bwords
    const youWords = username === host ? Bwords : Awords

    const createWordsInterval = setInterval(() => {
      if (currentWordIndex < words.length) {
        const myKeyword = words[currentWordIndex]
        const youKeyword = youWords[currentWordIndex]

        setMyGame((myGame) => [
          ...myGame,
          {
            y: myKeyword.y,
            speed: myKeyword.speed,
            x: myKeyword.x,
            keyword: myKeyword.keyword,
          },
        ])

        setYouGame((youGame) => [
          ...youGame,
          {
            y: youKeyword.y,
            speed: youKeyword.speed,
            x: youKeyword.x,
            keyword: youKeyword.keyword,
          },
        ])

        currentWordIndex++
      }
    }, 2000)

    // 내 단어 위치 업데이트
    const updateMyWordsInterval = setInterval(() => {
      setMyGame((game) =>
        game.map((item) => {
          const newY = item.y + item.speed
          return { ...item, y: newY }
        })
      )
    }, 30)

    // 상대방 단어 위치 업데이트
    const updateYouWordsInterval = setInterval(() => {
      setYouGame((game) =>
        game.map((item) => {
          const newY = item.y + item.speed
          return { ...item, y: newY }
        })
      )
    }, 30)

    const timeInterval = setInterval(() => {
      setTime((prevTime) => Math.max(prevTime - 1, 0))
    }, 1000)

    return () => {
      clearInterval(timeInterval)

      clearInterval(createWordsInterval)
      clearInterval(updateMyWordsInterval)
      clearInterval(updateYouWordsInterval)
      bootstrap.gameNetwork.room.removeAllListeners()

    }
  }, [])

  const keydown = (keyCode: number) => {
    if (keyCode === 13 && keywordInput.current) {
      const inputKeyword = keywordInput.current.value
      const isMyWord = myGame.some((word) => word.keyword === inputKeyword)
      if (isMyWord) {
        setMyGame((prevGame) => prevGame.filter((word) => word.keyword !== inputKeyword))
        setPoint((prevPoint) => prevPoint + 1)
      }
      keywordInput.current.value = ''
    }
  }

  // 친구 목숨, 내 목숨 표시

  let friendLifeElements = [];
  let myLifeElements = [];

  for (let i = 0; i < youState.heart; i++) {
    friendLifeElements.push(
      <img src={ eraser } width="50px" style={{ margin: '5px' }}></img>
    );
  }

  for (let i = 0; i < myState.heart; i++) {
    myLifeElements.push(
      <img src={ eraser } width="50px" style={{ margin: '5px' }}></img>
    );
  }

  return (
    <>
      <GameArea>
        <TimerArea>
          { time < 16 ?
            (
              <>
                <div id="timer" style={{ color: 'red' }}>
                  {String(time).padStart(3, '0')}
                </div>
              </>
            )
          :
            (
              <>
                <div id="timer">
                  {String(time).padStart(3, '0')}
                </div>
              </>
            )
          }
        </TimerArea>

        <Left>
          {youGame.map((word, index) => (
            <h5
              key={index}
              style={{
                position: 'absolute',
                fontSize: '1.4vw',
                letterSpacing: '0.3vw',
                top: `${word.y}px`,
                left: `${word.x}px`,
                color: '#FF7F00',
                zIndex: 2,
              }}
            >
              {word.keyword}
            </h5>
          ))}
        </Left>

        <Right>
            {myGame.map((word, index) => (
              <h5
                key={index}
                style={{
                  position: 'absolute',
                  fontSize: '1.4vw',
                  letterSpacing: '0.3vw',
                  top: `${word.y}px`,
                  left: `${word.x + 250}px`,
                  color: '#FFFFFF',
                  zIndex: 2,
                }}
              >
                {word.keyword}
              </h5>
            ))}
        </Right>
      </GameArea>

      <PointArea>
        <FriendPoint style={{ width: '40%', display: 'flex', position: 'relative' }}>
          <CharacterArea style={{ width: '30%' }}>
            <img src={ friendimgpath } width="60px" id="friend-character"></img>
          </CharacterArea>
          <NameArea style={{ width: '30%', marginTop: '30px' }}>
            친구 [{you.username.toUpperCase()}] <br/>
            { friendLifeElements }
          </NameArea>
        </FriendPoint>

        <InputArea style={{ width: '20%', marginTop: '20px', fontSize: '90px' }}>
          <Position>
            { youState.point }:{ myState.point }
          </Position>
        </InputArea>

        <MyPoint style={{ display: 'flex', position: 'relative' }}>
          <div style={{ width: '30%', marginTop: '30px' }}>
            <TextField
                label="명령어 입력 후 엔터"
                variant="outlined"
                inputRef={keywordInput}
                onKeyPress={(e) => keydown(e.charCode)}
                fullWidth
                style={{ fontSize: '20px' }}
            />
          </div>
          <NameArea style={{ width: '70%', marginTop: '30px' }}>
            나 [{ username.toUpperCase() }]<br/>
            { myLifeElements }
          </NameArea>
          <CharacterArea style={{ width: '20%' }}>
            <img src={ imgpath } width="60px" id="my-character"></img>
          </CharacterArea>
        </MyPoint>
      </PointArea>
    </>
  )
}
export default RainGame
