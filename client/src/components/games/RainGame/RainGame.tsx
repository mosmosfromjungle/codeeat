import React, { useEffect, useRef, useState } from 'react'
import rain_Background from '../../../../public/assets/game/RainGame/blackboard.png'
import { useAppDispatch ,useAppSelector} from '../../../hooks'
import Bootstrap from '../../../scenes/Bootstrap'
import phaserGame from '../../../PhaserGame'
import PointsAndHearts from './PointsAndHearts'
import ScoreInfo from './ScoreInfo'


export function RainGame() {
  const dispatch = useAppDispatch()
  const keywordInput = useRef<HTMLInputElement>(null)
  // const myWords = useAppSelector((state) => state.raingame.myWords)
  // const youWords = useAppSelector((state) => state.raingame.youWords)
  // const [localMyWords, setLocalMyWords] = useState(myWords);
  // const [localYouWords, setLocalYouWords] = useState(youWords);
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
  const [time, setTime] = useState(100)

  // const updateWordsPosition = () => {
  //   console.log('updateWordsPosition')

  //   const updatedMyWords = localMyWords.map(word => ({
  //     ...word,
  //     y: word.y + word.speed,
  //   }));
    
  //   const updatedYouWords = localYouWords.map(word => ({
  //     ...word,
  //     y: word.y + word.speed,
  //   }));

  //   setLocalMyWords(updatedMyWords);
  //   setLocalYouWords(updatedYouWords);
  // };
  const info = useAppSelector((state) => state.raingame)
  console.log("ㄹ조버루뱌ㅐ저ㅜ래ㅑㅂ저래ㅑ버재랴ㅓ")
  console.log(info)

  useEffect(() => {
    // const updateWordsInterval = setInterval(updateWordsPosition, 100);

    const timeInterval = setInterval(() => {
      setTime((prevTime) => Math.max(prevTime - 1, 0))
    }, 1000);

    return () => {
      clearInterval(timeInterval);
      bootstrap.gameNetwork.room.removeAllListeners();
      // clearInterval(updateWordsInterval);
    };

  }, [])

  const keydown = (keyCode) => {
    if (keyCode === 13 && keywordInput.current) {
      const text = keywordInput.current.value
      // dispatch(removeKeyword({ keyword: text, owner: username }))
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
        {/* Right Side (내것) */}
        <div
          style={{
            width: '40%',
            backgroundImage: `url(${rain_Background})`,
            backgroundSize: '100%',
            backgroundRepeat: 'no-repeat',
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'center',
          }}
        >
          {localMyWords.map((word, index) => (
            <h5
              key={index}
              style={{
                position: 'absolute',
                fontSize: '1.4vw',
                letterSpacing: '0.3vw',
                top: `${word.y}px`,
                left: `${word.x + 300}px`,
                color: '#FFFFFF',
                zIndex: 2,
                  }}
                >
                  {word.keyword}
                </h5>
            ))}
        </div>

        {/* Left Side (상대편) */}
        <div
          style={{
            width: '50vw',
            backgroundImage: `url(${rain_Background})`,
            backgroundSize: '100%',
            backgroundRepeat: 'no-repeat',
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'center',
          }}
        >
          {localYouWords.map((word, index) => (
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
      </div>

      {/* Winner Section */}
      {/* {winner && (
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
      )} */}

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
