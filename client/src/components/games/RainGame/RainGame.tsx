import React, { useEffect, useRef, useState } from 'react'
import rain_Background from '../../../../public/assets/game/RainGame/blackboard.png'
import { useSelector, useDispatch } from 'react-redux'
import { KeywordRain, removeKeyword, updateKeywords } from '../../../stores/RainGameStore'
import { RootState } from '../../../stores'
import flicker from '../../../../public/assets/game/RainGame/flicker.png'
import blind from '../../../../public/assets/game/RainGame/blind.png'
import accel from '../../../../public/assets/game/RainGame/accel.png'
import multiply from '../../../../public/assets/game/RainGame/multify.png'
import Bootstrap from '../../../scenes/Bootstrap'
import phaserGame from '../../../PhaserGame'
import PointsAndHearts from './PointsAndHearts'
import ScoreInfo from './ScoreInfo'

const calculateWinner = (myRainGameState, opponentRainGameState, time) => {
  if (myRainGameState && opponentRainGameState) {
    if (time <= 0) {
      return myRainGameState.points > opponentRainGameState.points ? 'A' : 'B'
    } else if (myRainGameState.heart <= 0) {
      return 'B'
    } else if (opponentRainGameState.heart <= 0) {
      return 'A'
    }
  }
  return null
}

const useUpdateKeywords = (dispatch, myRainGameState, opponentRainGameState, time) => {
  useEffect(() => {
    const updateKeywordsInterval = setInterval(() => {
      dispatch(updateKeywords({ owner: 'A' }))
      dispatch(updateKeywords({ owner: 'B' }))

      if (time <= 0 || myRainGameState?.heart <= 0 || opponentRainGameState?.heart <= 0) {
        clearInterval(updateKeywordsInterval)
      }
    }, 50)

    return () => clearInterval(updateKeywordsInterval)
  }, [dispatch, myRainGameState, opponentRainGameState, time])
}

export function RainGame({clientId }) {
  const dispatch = useDispatch()
  const keywordInput = useRef<HTMLInputElement>(null)
  const rainGameState = useSelector((state: RootState) => state.raingame)
  const rainGameDialogState = useSelector((state: RootState) => state.rainGameDialog)
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
  
  const myRainGameState = rainGameState.states.find((rgs) => rgs.owner ===clientId);
  const opponentRainGameState = rainGameState.states.find((rgs) => rgs.owner !== clientId);

  const [time, setTime] = useState(100)
  const [items, setItems] = useState([])

  useUpdateKeywords(dispatch, myRainGameState, opponentRainGameState, time)

  useEffect(() => {
    bootstrap.gameNetwork.MakingWord()

    const timeInterval = setInterval(() => {
      setTime((prevTime) => Math.max(prevTime - 1, 0))
    }, 1000)

    return () => {
      clearInterval(timeInterval)
    }
  }, [])

  const winner = calculateWinner(myRainGameState, opponentRainGameState, time)

  const keydown = (keyCode) => {
    if (keyCode === 13 && keywordInput.current) {
      const text = keywordInput.current.value
      dispatch(removeKeyword({ keyword: text, owner: 'A' }))
      keywordInput.current.value = ''
    }
  }
  return (
    <>
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
          color: '#fff',
        }}
      >
        {String(time).padStart(3, '0')}
      </div>

      {/* Game Section */}
      <div
        style={{
          display: 'flex',
          position: 'relative',
          height: 'calc(75vh - 6px)',
        }}
      >
        {/* Left Side (내것) */}
        <div
          style={{
            width: '50vw',
            backgroundImage: `url(${rain_Background})`,
            backgroundSize: '50%',
            backgroundRepeat: 'no-repeat',
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'center',
          }}
        >
          {myRainGameState &&
            myRainGameState.words.map((item: KeywordRain, index: number) => {
              if (item.y > window.innerHeight * 0.8) {
                return null
              }
              let backgroundImage = ''
              if (item.flicker) {
                backgroundImage = `url(${flicker})`
              } else if (item.blind) {
                backgroundImage = `url(${blind})`
              } else if (item.accel) {
                backgroundImage = `url(${accel})`
              } else if (item.multifly) {
                backgroundImage = `url(${multiply})`
              }
              return (
                <h5
                  key={index}
                  style={{
                    position: 'absolute',
                    fontSize: '1.4vw',
                    letterSpacing: '0.3vw',
                    top: `${item.y}px`,
                    left: `${item.x}px`,
                    color: '#FFFFFF',
                    backgroundImage: backgroundImage,
                    backgroundSize: '150% 150%',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'top',
                    zIndex: 2,
                  }}
                >
                  {item.keyword}
                </h5>
              )
            })}
        </div>

        {/* Right Side (상대편) */}
        <div
          style={{
            width: '50vw',
            backgroundImage: `url(${rain_Background})`,
            backgroundSize: '50%',
            backgroundRepeat: 'no-repeat',
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'center',
          }}
        >
          {opponentRainGameState &&
            opponentRainGameState.words.map((item: KeywordRain, index: number) => {
              if (item.y > window.innerHeight * 0.8) {
                return null
              }
              let backgroundImage = ''
              if (item.flicker) {
                backgroundImage = `url(${flicker})`
              } else if (item.blind) {
                backgroundImage = `url(${blind})`
              } else if (item.accel) {
                backgroundImage = `url(${accel})`
              } else if (item.multifly) {
                backgroundImage = `url(${multiply})`
              }
              return (
                <h5
                  key={index}
                  style={{
                    position: 'absolute',
                    fontSize: '1.4vw',
                    letterSpacing: '0.3vw',
                    top: `${item.y}px`,
                    left: `${item.x + 300}px`,
                    color: '#FF7F00',
                    backgroundImage: backgroundImage,
                    backgroundSize: '150% 150%',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'top',
                    zIndex: 2,
                  }}
                >
                  {item.keyword}
                </h5>
              )
            })}
        </div>
      </div>

      {/* Winner Section */}
      {winner && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: 30,
            color: 'red',
          }}
        >
          {winner} is the winner!
        </div>
      )}

      {/* Input and Score Section */}
      <div
        style={{
          display: 'flex',
          fontSize: '1vw',
          position: 'absolute',
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          alignItems: 'center',
        }}
      >
        {/* Left Side - Score and Lives */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div 
            style={{ 
                marginBottom: '6px', 
                fontWeight: 'bold', 
                fontSize: '1.5vw' 
                }}
            >
                나
            </div>
          {rainGameState.states && rainGameState.states.length > 0 ? (
            <ScoreInfo 
                score={rainGameState.states[0].point} 
                coin={rainGameState.states[0].heart} 
            />
        ) : (
            <ScoreInfo score={0} coin={0} />
          )}
        </div>

        {/* Input Section - Text Field and Button */}
        <div style={{ flex: 1, textAlign: 'center' }}>
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

        {/* Right Side - Score and Lives */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div 
            style={{ 
                marginBottom: '6px', 
                fontWeight: 'bold', 
                fontSize: '1.5vw', 
            }}
        >
            상대편
        </div>
          {rainGameState.states && rainGameState.states.length > 1 ? (
            <ScoreInfo 
                score={rainGameState.states[1].point} 
                coin={rainGameState.states[1].heart} 
            />
        ) : (
            <ScoreInfo score={0} coin={0} />
        )}
    </div>
</div>

{/* Points and Hearts */}
<div
                style={{
                    display: "flex",
                    fontSize: "1vw",
                    position: "absolute",
                    bottom: "0",
                    left: "0",
                    right: "0",
                    justifyContent: "center",
                    marginBottom: "6px",
                }}
            >
        <PointsAndHearts />
      </div>
    </>
  );
}
export default RainGame
