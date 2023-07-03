import React, { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import Bootstrap from '../../../scenes/Bootstrap'
import phaserGame from '../../../PhaserGame'
import TextField from '@mui/material/TextField'
import { 
  CharacterArea, NameArea, Position, 
  TimerArea, GameArea, Left, Right, PointArea, FriendPoint, MyPoint, 
  InputArea, PlayArea, Comment, 
} from './RainGameStyle'
import eraser from '/assets/game/RainGame/eraser.png'
import debounce from 'lodash/debounce';

interface KeywordRain {
  y: number
  speed: number
  keyword: string
  x: number
  itemA: boolean,
  itemB: boolean,

}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function RainGame() {

  const raingame = useAppSelector((state) => state.raingame)
  const canvasHeight = 50
  const lineHeight = canvasHeight + 550
  const dispatch = useAppDispatch()
  const keywordInput = useRef<HTMLInputElement>(null)
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
  const [time, setTime] = useState(100)
  const host = useAppSelector((state) => state.raingame.host)
  const sessionId = useAppSelector((state) => state.user.gameSessionId)

  // My information
  const username = useAppSelector((state) => state.user.username)
  const character = useAppSelector((state) => state.user.character)
  const imgpath = `/assets/character/single/${capitalizeFirstLetter(character)}_idle_anim_19.png`;
  
  // Friend information
  const youInfo = useAppSelector((state) => state.raingame.you)
  const friendimgpath = `/assets/character/single/${capitalizeFirstLetter(youInfo.character)}_idle_anim_19.png`;

  const [myGame, setMyGame] = useState<KeywordRain[]>([])
  const [youGame, setYouGame] = useState<KeywordRain[]>([])
  const [myState, setMyState] = useState({ heart: raingame.myState.heart, point: raingame.myState.point, item: raingame.myState.item })
  const [youState, setYouState] = useState({ heart: raingame.youState.heart, point: raingame.youState.point, item: raingame.youState.item})
  const targetword = useAppSelector((state) => state.raingame.words);
  const targetwordRef = useRef(targetword);
  const [dheart, setDheart] = useState(false);
  const myExtraSpeedRef = useRef(0);
  const youExtraSpeedRef = useRef(0);

  const Awords = [
    { y: 0, speed: 1, keyword: 'abs', x: 331, itemA : true, itemB : false },
    { y: 0, speed: 1.5, keyword: 'print', x: 253, itemA : false, itemB : false },
    { y: 0, speed: 1, keyword: 'list', x: 182, itemA : false, itemB : false },
    { y: 0, speed: 1.5, keyword: 'row', x: 413, itemA : false, itemB : false },
    { y: 0, speed: 1, keyword: 'col', x: 395, itemA : false, itemB : false },
    { y: 0, speed: 1.5, keyword: 'set', x: 267, itemA : false, itemB : false },
    { y: 0, speed: 1, keyword: 'style', x: 149, itemA : false, itemB : true },
    { y: 0, speed: 1.5, keyword: 'font', x: 347, itemA : false, itemB : false },
    { y: 0, speed: 1, keyword: 'div', x: 278, itemA : false, itemB : false },
    { y: 0, speed: 1.5, keyword: 'h1', x: 221, itemA : false, itemB : false },
    { y: 0, speed: 1, keyword: 'h2', x: 443, itemA : false, itemB : false },
    { y: 0, speed: 1.5, keyword: 'body', x: 381, itemA : false, itemB : false },
    { y: 0, speed: 1, keyword: 'apple', x: 399, itemA : true, itemB : false },
    { y: 0, speed: 1.5, keyword: 'banana', x: 273, itemA : false, itemB : false },
    { y: 0, speed: 1, keyword: 'car', x: 331, itemA : false, itemB : false },
    { y: 0, speed: 1.5, keyword: 'dog', x: 253, itemA : false, itemB : false },
    { y: 0, speed: 1, keyword: 'elephant', x: 182, itemA : false, itemB : false },
    { y: 0, speed: 1.5, keyword: 'flower', x: 413, itemA : false, itemB : false },
    { y: 0, speed: 1, keyword: 'guitar', x: 395, itemA : false, itemB : true },
    { y: 0, speed: 1.5, keyword: 'house', x: 267, itemA : false, itemB : false },
    { y: 0, speed: 1, keyword: 'ice cream', x: 149, itemA : false, itemB : false },
    { y: 0, speed: 1.5, keyword: 'jungle', x: 347, itemA : false, itemB : false },
    { y: 0, speed: 1, keyword: 'kangaroo', x: 278, itemA : false, itemB : false },
    { y: 0, speed: 1.5, keyword: 'lion', x: 221, itemA : false, itemB : false },
    { y: 0, speed: 1, keyword: 'monkey', x: 443, itemA : true, itemB : false },
    { y: 0, speed: 1.5, keyword: 'notebook', x: 381, itemA : false, itemB : false },
    { y: 0, speed: 1, keyword: 'orange', x: 399, itemA : false, itemB : false },
    { y: 0, speed: 1.5, keyword: 'piano', x: 273, itemA : false, itemB : false },
    { y: 0, speed: 1, keyword: 'queen', x: 331, itemA : false, itemB : false },
    { y: 0, speed: 1.5, keyword: 'rabbit', x: 253, itemA : false, itemB : true },
  ]
  const Bwords = [
    { y: 0, speed: 1.2, keyword: 'zebra', x: 467, itemA: false, itemB: true },
    { y: 0, speed: 1.4, keyword: 'umbrella', x: 174, itemA : false, itemB : false },
    { y: 0, speed: 1.3, keyword: 'table', x: 290, itemA : false, itemB : false },
    { y: 0, speed: 1.1, keyword: 'snake', x: 485, itemA : false, itemB : false },
    { y: 0, speed: 1.5, keyword: 'rocket', x: 310, itemA : false, itemB : false },
    { y: 0, speed: 1.4, keyword: 'pizza', x: 450, itemA : false, itemB : false },
    { y: 0, speed: 1.2, keyword: 'ocean', x: 200, itemA : true, itemB : false },
    { y: 0, speed: 1.3, keyword: 'moon', x: 388, itemA : false, itemB : false },
    { y: 0, speed: 1.1, keyword: 'laptop', x: 333, itemA : false, itemB : false },
    { y: 0, speed: 1.5, keyword: 'kiwi', x: 223, itemA : false, itemB : false },
    { y: 0, speed: 1.2, keyword: 'island', x: 411, itemA : false, itemB : false },
    { y: 0, speed: 1.3, keyword: 'hat', x: 274, itemA : false, itemB : false },
    { y: 0, speed: 1.4, keyword: 'grape', x: 492, itemA : false, itemB : true },
    { y: 0, speed: 1.2, keyword: 'forest', x: 267, itemA : false, itemB : false },
    { y: 0, speed: 1.1, keyword: 'eagle', x: 300, itemA : false, itemB : false },
    { y: 0, speed: 1.5, keyword: 'drum', x: 475, itemA : false, itemB : false },
    { y: 0, speed: 1.3, keyword: 'chocolate', x: 230, itemA : false, itemB : false },
    { y: 0, speed: 1.4, keyword: 'book', x: 365, itemA : false, itemB : false },
    { y: 0, speed: 1.2, keyword: 'ant', x: 415, itemA : true, itemB : false },
    { y: 0, speed: 1.1, keyword: 'window', x: 320, itemA : false, itemB : false },
    { y: 0, speed: 1.5, keyword: 'television', x: 470, itemA : false, itemB : false },
    { y: 0, speed: 1.2, keyword: 'sun', x: 190, itemA : false, itemB : false },
    { y: 0, speed: 1.3, keyword: 'rain', x: 422, itemA : false, itemB : false },
    { y: 0, speed: 1.4, keyword: 'penguin', x: 237, itemA : false, itemB : false },
    { y: 0, speed: 1.1, keyword: 'otter', x: 393, itemA : false, itemB : true },
    { y: 0, speed: 1.5, keyword: 'night', x: 255, itemA : false, itemB : false },
    { y: 0, speed: 1.3, keyword: 'mountain', x: 288, itemA : false, itemB : false },
    { y: 0, speed: 1.2, keyword: 'light', x: 444, itemA : false, itemB : false },
    { y: 0, speed: 1.4, keyword: 'kite', x: 317, itemA : false, itemB : false },
    { y: 0, speed: 1.5, keyword: 'jazz', x: 217, itemA : true, itemB : false },
  ]
  const debouncedDecreaseHeart = debounce(() => {
    bootstrap.gameNetwork.decreaseHeart(sessionId);
  }, 300);
  useEffect(() => {
  const updateMyWordsInterval = setInterval(() => {
    setMyGame((game) =>
      game.reduce((newGame, item) => {
        const newY = item.y + item.speed + myExtraSpeedRef.current;

        if (newY >= lineHeight && !dheart) {
          debouncedDecreaseHeart();
          setDheart(true)
        } else{
        newGame.push({ ...item, y: newY });
      }
      return newGame
    }, [])
    );
    
  }, 100);
  const meItemInterval = setInterval(() => {
    if (myState.item && myState.item.length >0) {
      console.log("나에게 아이템 적용")
      ItemToMe(myState.item[0]);
      setMyState(prevState => {
        // prevState.item 이 배열인 경우에만 slice 메서드를 사용
        const newItem = Array.isArray(prevState.item) ? prevState.item.slice(1) : [];
        return { ...prevState, item: newItem };
      });
    }
  }, 300);
const updateYouWordsInterval = setInterval(() => {
    setYouGame((game) =>
      game.reduce((newGame, item) => {
        const newY = item.y + item.speed + youExtraSpeedRef.current;
        
        if(targetwordRef.current.length > 0 && targetwordRef.current === item.keyword) {
        } else if (newY < lineHeight) {
          newGame.push({ ...item, y: newY });
        } 
        return newGame
      }, [])
    );
  }, 100)

  const youItemInterval = setInterval(() => {
    if (youState.item && youState.item.length > 0) {
      console.log("상대에게 아이템 적용")
      ItemToYou(youState.item[0]);
      setYouState(prevState => {
        // prevState.item 이 배열인 경우에만 slice 메서드를 사용
        const newItem = Array.isArray(prevState.item) ? prevState.item.slice(1) : [];
        return { ...prevState, item: newItem };
      });
    }
  }, 300);
  return () => {
    clearInterval(updateYouWordsInterval)
    clearInterval(youItemInterval)
    clearInterval(updateMyWordsInterval)
    clearInterval(meItemInterval)
  }

},[raingame])



  useEffect(() => {
    setMyState({ heart: raingame.myState.heart, point: raingame.myState.point, item: raingame.myState.item });
    setDheart(false);
    setYouState({ heart: raingame.youState.heart, point: raingame.youState.point, item: raingame.youState.item });
  }, [raingame]);

  useEffect(() => {
    targetwordRef.current = targetword;
  }, [targetword]);

  useEffect(() => {
 
    let currentWordIndex = 0
    const mywords = username === host ? Awords : Bwords
    const youWords = username === host ? Bwords : Awords

    const createWordsInterval = setInterval(() => {
      if (currentWordIndex < mywords.length) {
        const myKeyword = mywords[currentWordIndex]
        const youKeyword = youWords[currentWordIndex]

        setMyGame((myGame) => [
          ...myGame,
          {
            y: myKeyword.y,
            speed: myKeyword.speed,
            x: myKeyword.x,
            keyword: myKeyword.keyword,
            itemA: myKeyword.itemA,
            itemB: myKeyword.itemB,
          },
        ])

        setYouGame((youGame) => [
          ...youGame,
          {
            y: youKeyword.y,
            speed: youKeyword.speed,
            x: youKeyword.x,
            keyword: youKeyword.keyword,
            itemA: youKeyword.itemA,
            itemB: youKeyword.itemB,
          },
        ])

        currentWordIndex++
      }
    }, 2000)

    // 데바운싱 적용
    

    // 내 단어 위치 업데이트
    

    // 시간 측정
    const timeInterval = setInterval(() => {
      setTime((prevTime) => Math.max(prevTime - 1, 0))
    }, 1000)

    return () => {
      clearInterval(timeInterval)
      clearInterval(createWordsInterval)

    }
  }, [])

  const keydown = (keyCode: number) => {
    if (keyCode === 13 && keywordInput.current) {
      const inputKeyword = keywordInput.current.value;
      const MyWord = myGame.find((word) => word.keyword === inputKeyword);
      if (MyWord) {
        setMyGame((prevGame) => prevGame.filter((word) => word.keyword !== inputKeyword))
        bootstrap.gameNetwork.removeWord(inputKeyword,sessionId,raingame )

        if (MyWord.itemA) {
          bootstrap.gameNetwork.useItem('A');
          console.log("아이템 포착:A")
        }
        if (MyWord.itemB) {
          bootstrap.gameNetwork.useItem('B');
          console.log("아이템포착:B")
        }
      } else{
        /* for 지원 : 입력이 틀렸을 때 로직 넣는 곳 */  
      }
      keywordInput.current.value = ''
    }
  }

  const ItemToMe = (item) => {
    switch (item) {
        case 'A':
            // extraSpeed를 2로 설정
            myExtraSpeedRef.current = 5;
            console.log("아이템 본인 적용 함수 호출됌")

            // 5초 후에 extraSpeed를 0으로 되돌리기
            setTimeout(() => {
                myExtraSpeedRef.current = 0;
            }, 5000);
            break;
        case 'B':
            // 내부 로직은 각주로 비워두기
            // ...
            break;
        // ... 다른 케이스들
    }
  };

  const ItemToYou = (item) => {
    switch (item) {
        case 'A':
            // extraSpeed를 2로 설정
            youExtraSpeedRef.current = 5;
            console.log("아이템 상대 적용 함수 호출됌")

            // 5초 후에 extraSpeed를 0으로 되돌리기
            setTimeout(() => {
                youExtraSpeedRef.current = 0;
            }, 5000);
            break;
        case 'B':
            // 내부 로직은 각주로 비워두기
            // ...
            break;
        // ... 다른 케이스들
    }
  };

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
                  left: `${word.x + 120}px`,
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
        <FriendPoint>
          <CharacterArea>
            <img src={ friendimgpath } width="60px" id="friend-character"></img>
          </CharacterArea>
          <NameArea>
            친구 [{you.username.toUpperCase()}] <br/>
            { friendLifeElements }
          </NameArea>
        </FriendPoint>

        <PlayArea>
          
        </PlayArea>

        <InputArea>
          <Position>
            { youState.point }:{ myState.point }
          </Position>
        </InputArea>

        <PlayArea>
          <div>
            <Comment>
              명령어를 입력한 후 엔터를 쳐주세요 !
            </Comment>
            <TextField
                focused
                inputRef={keywordInput}
                onKeyPress={(e) => keydown(e.charCode)}
                fullWidth
                InputProps={{
                  style: {
                    width: '300px',
                  },
                }}
            />
            <button onClick={() => keydown(13)} style={{ display: 'none' }}></button>
          </div>
        </PlayArea>

        <MyPoint>
          <NameArea>
            나 [{ username.toUpperCase() }]<br/>
            { myLifeElements }
          </NameArea>
          <CharacterArea>
            <img src={ imgpath } width="60px" id="my-character"></img>
          </CharacterArea>
        </MyPoint>
      </PointArea>
    </>
  )
}
export default RainGame
