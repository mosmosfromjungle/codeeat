import React, { useEffect, useRef, useState } from 'react'
import rain_Background from '../../../../public/assets/game/RainGame/blackboard.png'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import Bootstrap from '../../../scenes/Bootstrap'
import phaserGame from '../../../PhaserGame'
import { setRainGameMyState, setRainGameYouState } from '../../../stores/RainGameStore'

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

export function RainGame() {
  const canvasHeight = 50
  const lineHeight = canvasHeight + 550
  const dispatch = useAppDispatch()
  const keywordInput = useRef<HTMLInputElement>(null)
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
  const [time, setTime] = useState(100)

  const host = useAppSelector((state) => state.raingame.host)
  const username = useAppSelector((state) => state.user.username)
  const [myGame, setMyGame] = useState<KeywordRain[]>([])
  const [youGame, setYouGame] = useState<KeywordRain[]>([])
  const [myState, setMyState] = useState({ heart: 3, point: 0 })
  const youState = useAppSelector((state) => state.raingame.youState)
  const me = useAppSelector((state) => state.raingame.me)
  const you = useAppSelector((state) => state.raingame.you)
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

          if (newY >= lineHeight) {
            setMyState((prevState) => ({ ...prevState, heart: prevState.heart - 1 }))
          }
          return { ...item, y: newY }
        })
      )
    }, 30)

    const checkHeartInterval = setInterval(() => {
      setMyGame((prevGame) => {
        let heartDecreased = false
        const filteredGame = prevGame.filter((word) => {
          if (word.y >= lineHeight) {
            heartDecreased = true
            return false
          }
          return true
        })

        if (heartDecreased) {
          setMyState((prevState) => ({ ...prevState, heart: prevState.heart - 1 }))
        }
        return filteredGame
      })
    }, 100)

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
      clearInterval(checkHeartInterval)
      bootstrap.gameNetwork.room.removeAllListeners()
    }
  }, [])

  const keydown = (keyCode: number) => {
    if (keyCode === 13 && keywordInput.current) {
      const inputKeyword = keywordInput.current.value
      const isMyWord = myGame.some((word) => word.keyword === inputKeyword)
      if (isMyWord) {
        setMyGame((prevGame) => prevGame.filter((word) => word.keyword !== inputKeyword))
        setMyState((prevState) => ({ ...prevState, point: prevState.point + 1 }))
      }
      keywordInput.current.value = ''
    }
  }

  return (
    <>
      {/* canvasHeight 선 */}
      <div
        style={{
          position: 'absolute',
          top: `${canvasHeight}px`,
          left: '0',
          width: '100%',
          height: '2px',
          backgroundColor: 'red',
        }}
      ></div>
      {/* 중앙분리선 */}
      <div
        style={{
          position: 'absolute',
          backgroundColor: 'yellow',
          height: '546px',
          top: '53px',
          left: '50%',
          width: '2px',
          transform: 'translateX(-50%)',
        }}
      ></div>

      {/* lineHeight 선 */}
      <div
        style={{
          position: 'absolute',
          top: `${lineHeight}px`,
          left: '0',
          width: '100%',
          height: '2px',
          backgroundColor: 'blue',
        }}
      ></div>
      {/* Time Section */}
      <div
        id="timer"
        style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '20px',
          zIndex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          padding: '10px',
          borderRadius: '5px',
          color: time <= 15 ? 'red' : '#fff',
          animation: time <= 15 ? 'blink 1s linear infinite' : 'none',
        }}
      >
        {String(time).padStart(3, '0')}
      </div>

      {/* Game Section */}
      <div
        style={{
          display: 'flex',
          position: 'relative',
          height: '77vh',
          justifyContent: 'space-around',
        }}
      >
        {/* Left Side (상대편) */}
        <div
          style={{
            width: '40vw',
            backgroundImage: `url(${rain_Background})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'center',
          }}
        >
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
        </div>

        {/* Right Side (내것) */}
        <div
          style={{
            width: '40vw',
            backgroundImage: `url(${rain_Background})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'center',
          }}
        >
          {myGame.map((word, index) => (
            <h5
              key={index}
              style={{
                position: 'absolute',
                fontSize: '1.4vw',
                letterSpacing: '0.3vw',
                top: `${word.y}px`,
                left: `${word.x}px`,
                color: '#FFFFFF',
                zIndex: 2,
              }}
            >
              {word.keyword}
            </h5>
          ))}
        </div>
      </div>

      {/* Input Section - Text Field and Button */}
      <div
        style={{
          textAlign: 'center',
          position: 'absolute',
          bottom: `${canvasHeight - 15}px`,
          transform: 'translateX(-50%)',
          left: '75%',
          zIndex: 2,
        }}
      >
        <input
          ref={keywordInput}
          placeholder="text"
          onKeyPress={(e) => keydown(e.charCode)}
          style={{ marginRight: '1vw', fontSize: '1vw' }}
        />
        <button
          onClick={() => keydown(13)}
          style={{
            fontSize: '1vw',
            marginBottom: '3vw',
            padding: '0.5vw 1vw',
            fontWeight: 'bold',
          }}
        >
          입력
        </button>
      </div>

      {/* Opponent's Info */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          position: 'absolute',
          width: '50%',
          padding: '0 20px',
          bottom: '50px',
        }}
      >
        {/* Left Side - Opponent's Info */}
        <div style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '30%', fontSize: '20px', fontWeight: 'bold' }}>
            {' '}
            {you.username}
          </div>
          <div style={{ fontSize: '1.2vw', fontWeight: 'bold' }}>{you.character}</div>
        </div>
      </div>

      {/* My Info */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          position: 'absolute',
          width: '50%',
          padding: '0 20px',
          bottom: '50px',
          right: '0',
        }}
      >
        {/* Right Side - My Info */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ marginBottom: '30%', fontSize: '20px', fontWeight: 'bold' }}>
            {' '}
            {me.username}
          </div>
          <div style={{ fontSize: '1.2vw', fontWeight: 'bold' }}>{me.character}</div>
        </div>
      </div>

      {/* Points and Hearts */}
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: '50px', textAlign: 'right', fontSize: '20px', fontWeight: 'bold' }}>
            {youState.heart}
          </div>
          <div style={{ margin: '0 20px' }}>목숨</div>
          <div style={{ width: '50px', textAlign: 'left', fontSize: '20px', fontWeight: 'bold' }}>
            {myState.heart}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '50px', textAlign: 'right', fontSize: '20px', fontWeight: 'bold' }}>
            {youState.point}
          </div>
          <div style={{ margin: '0 20px' }}>점수</div>
          <div style={{ width: '50px', textAlign: 'left', fontSize: '20px', fontWeight: 'bold' }}>
            {myState.point}
          </div>
        </div>
      </div>
    </>
  )
}
export default RainGame
