import React, { useEffect, useRef, useState } from 'react'
import rain_Background from '../../../../public/assets/game/RainGame/blackboard.png'
import { useAppDispatch ,useAppSelector} from '../../../hooks'
import Bootstrap from '../../../scenes/Bootstrap'
import phaserGame from '../../../PhaserGame'
import PointsAndHearts from './PointsAndHearts'
import ScoreInfo from './ScoreInfo'

interface KeywordRain {
  y: number,
  speed: number,
  keyword: string,
  x: number,
  // flicker: boolean,
  // blind: boolean,
  // accel: boolean,
  // multifly: boolean,
}

export function RainGame() {
  const dispatch = useAppDispatch()
  const keywordInput = useRef<HTMLInputElement>(null)
  const canvasHeight = 1000;
  const lineHeight = canvasHeight - 500;
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
  const [time, setTime] = useState(100)
  const [game, setGame] = useState<KeywordRain[]>([]);
  const [point, setPoint] = useState<number>(0);
    
    // const [heart, setHeart] = useState<number>(5);
    // const [level, setLevel] = useState<number>(1);
    // const [goal, setGoal] = useState<number>(10);

    const Awords = [
      { y: 0, speed: 1, keyword: "abs", x: 331 },
      { y: 0, speed: 1.5, keyword: "print", x: 253 },
      { y: 0, speed: 1, keyword: "list", x: 182 },
      { y: 0, speed: 1.5, keyword: "row", x: 413 },
      { y: 0, speed: 1, keyword: "col", x: 395 },
      { y: 0, speed: 1.5, keyword: "set", x: 267 },
      { y: 0, speed: 1, keyword: "style", x: 149 },
      { y: 0, speed: 1.5, keyword: "font", x: 347 },
      { y: 0, speed: 1, keyword: "div", x: 278 },
      { y: 0, speed: 1.5, keyword: "h1", x: 221 },
      { y: 0, speed: 1, keyword: "h2", x: 443 },
      { y: 0, speed: 1.5, keyword: "body", x: 381 },
      { y: 0, speed: 1, keyword: "apple", x: 399 },
      { y: 0, speed: 1.5, keyword: "banana", x: 273 },
      { y: 0, speed: 1, keyword: "car", x: 331 },
      { y: 0, speed: 1.5, keyword: "dog", x: 253 },
      { y: 0, speed: 1, keyword: "elephant", x: 182 },
      { y: 0, speed: 1.5, keyword: "flower", x: 413 },
      { y: 0, speed: 1, keyword: "guitar", x: 395 },
      { y: 0, speed: 1.5, keyword: "house", x: 267 },
      { y: 0, speed: 1, keyword: "ice cream", x: 149 },
      { y: 0, speed: 1.5, keyword: "jungle", x: 347 },
      { y: 0, speed: 1, keyword: "kangaroo", x: 278 },
      { y: 0, speed: 1.5, keyword: "lion", x: 221 },
      { y: 0, speed: 1, keyword: "monkey", x: 443 },
      { y: 0, speed: 1.5, keyword: "notebook", x: 381 },
      { y: 0, speed: 1, keyword: "orange", x: 399 },
      { y: 0, speed: 1.5, keyword: "piano", x: 273 },
      { y: 0, speed: 1, keyword: "queen", x: 331 },
      { y: 0, speed: 1.5, keyword: "rabbit", x: 253 }
    ]
    const BWords = [
      { y: 0, speed: 1.2, keyword: "zebra", x: 467 },
      { y: 0, speed: 1.4, keyword: "umbrella", x: 174 },
      { y: 0, speed: 1.3, keyword: "table", x: 290 },
      { y: 0, speed: 1.1, keyword: "snake", x: 485 },
      { y: 0, speed: 1.5, keyword: "rocket", x: 310 },
      { y: 0, speed: 1.4, keyword: "pizza", x: 450 },
      { y: 0, speed: 1.2, keyword: "ocean", x: 200 },
      { y: 0, speed: 1.3, keyword: "moon", x: 388 },
      { y: 0, speed: 1.1, keyword: "laptop", x: 333 },
      { y: 0, speed: 1.5, keyword: "kiwi", x: 223 },
      { y: 0, speed: 1.2, keyword: "island", x: 411 },
      { y: 0, speed: 1.3, keyword: "hat", x: 274 },
      { y: 0, speed: 1.4, keyword: "grape", x: 492 },
      { y: 0, speed: 1.2, keyword: "forest", x: 267 },
      { y: 0, speed: 1.1, keyword: "eagle", x: 300 },
      { y: 0, speed: 1.5, keyword: "drum", x: 475 },
      { y: 0, speed: 1.3, keyword: "chocolate", x: 230 },
      { y: 0, speed: 1.4, keyword: "book", x: 365 },
      { y: 0, speed: 1.2, keyword: "ant", x: 415 },
      { y: 0, speed: 1.1, keyword: "window", x: 320 },
      { y: 0, speed: 1.5, keyword: "television", x: 470 },
      { y: 0, speed: 1.2, keyword: "sun", x: 190 },
      { y: 0, speed: 1.3, keyword: "rain", x: 422 },
      { y: 0, speed: 1.4, keyword: "penguin", x: 237 },
      { y: 0, speed: 1.1, keyword: "otter", x: 393 },
      { y: 0, speed: 1.5, keyword: "night", x: 255 },
      { y: 0, speed: 1.3, keyword: "mountain", x: 288 },
      { y: 0, speed: 1.2, keyword: "light", x: 444 },
      { y: 0, speed: 1.4, keyword: "kite", x: 317 },
      { y: 0, speed: 1.5, keyword: "jazz", x: 217 }
    ]


  useEffect(() => {
    let currentWordIndex = 0;
    const interval1 = setInterval(() => {
      if(currentWordIndex < words.length) {
      const keyword = words[currentWordIndex];
      setGame(game => [...game,{
        y: keyword.y,
        speed: keyword.speed,
        x: keyword.x,
        keyword: keyword.keyword
      }]);
      currentWordIndex++;
    }
  }, 2000);

  const interval2 = setInterval(() => {
    setGame((game) =>
        game.map((item) => {
            const newY = item.y + item.speed;
            if (newY > lineHeight && item.y <= lineHeight) {
              
            }
            return { ...item, y: newY }
        })
    );
}, 50);

  const timeInterval = setInterval(() => {
      setTime((prevTime) => Math.max(prevTime - 1, 0))
    }, 1000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(interval1)
      clearInterval(interval2)
      bootstrap.gameNetwork.room.removeAllListeners();
      // clearInterval(updateWordsInterval);
    };

  }, [])

  const removeNode = (keywordToRemove: string) => {
    setGame((game) => game.filter((item) => item.keyword !== keywordToRemove));
  };
  
  const keydown = (keyCode: number) => {
    if (keyCode === 13 && keywordInput.current) {
      const text = keywordInput.current.value;
        removeNode(text);
        setPoint((prevPoint) => prevPoint + 1);  
      keywordInput.current.value = "";
    }
  };

//   const removeNode = (keywordToRemove: string) => {
//     setGame((game) => game.filter((item) => item.keyword !== keywordToRemove));
//     setKeywordList((keywords) =>
//         keywords.filter((keyword) => keyword !== keywordToRemove)
//     );
// };

// const keydown = (keyCode: number) => {
//   if (keyCode === 13 && keywordInput.current) {
//       const text = keywordInput.current.value;
//       if (keywordList.includes(text)) {
//           removeNode(text);
//           setPoint(point + 1);
//           setKeywordList((prevKeywords) =>
//               prevKeywords.filter(keyword => keyword !== text)
//           );
//       }
//       keywordInput.current.value = "";
//     }
//   };

  // const keydown = (keyCode) => {
  //   if (keyCode === 13 && keywordInput.current) {
  //     const text = keywordInput.current.value
  //     // dispatch(removeKeyword({ keyword: text, owner: username }))
  //     keywordInput.current.value = ''
  //   }
  // }

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
          {game.map((word, index) => (
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
          {game.map((word, index) => (
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
