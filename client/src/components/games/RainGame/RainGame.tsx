import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import Bootstrap from '../../../scenes/Bootstrap'
import phaserGame from '../../../PhaserGame'
import TextField from '@mui/material/TextField'
import { 
  CharacterArea, NameArea, Position, 
  TimerArea, GameArea, Left, Right, PointArea, FriendPoint, MyPoint, 
  InputArea, PlayArea, Comment, Item, 
} from './RainGameStyle'
import eraser from '/assets/game/RainGame/eraser.png'
import debounce from 'lodash/debounce'
import RainGameItemB from './RainGameItemB'
import { DIALOG_STATUS, setDialogStatus } from '../../../stores/UserStore'
import { closeRainGameDialog } from '../../../stores/RainGameDialogStore'

interface KeywordRain {
  y: number
  speed: number
  keyword: string
  x: number
  itemA: boolean
  itemB: boolean
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function RainGame() {
  const raingame = useAppSelector((state) => state.raingame)
  const canvasHeight = 50
  const lineHeight = canvasHeight + 550
  const dispatch = useAppDispatch()
  const keywordInput = useRef<HTMLInputElement>(null)
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
  const [time, setTime] = useState(10)
  const host = useAppSelector((state) => state.raingame.host)
  const sessionId = useAppSelector((state) => state.user.gameSessionId)
  // const inProgress = 

  // My information
  const username = useAppSelector((state) => state.user.username)
  const character = useAppSelector((state) => state.user.character)
  const imgpath = `/assets/character/single/${capitalizeFirstLetter(character)}.png`;
  
  // Friend information
  const you = useAppSelector((state) => state.raingame.you)
  const friendimgpath = `/assets/character/single/${capitalizeFirstLetter(you.character)}.png`;
  const [myGame, setMyGame] = useState<KeywordRain[]>([])
  const [youGame, setYouGame] = useState<KeywordRain[]>([])
  const [myState, setMyState] = useState({
    heart: raingame.myState.heart,
    point: raingame.myState.point,
    item: raingame.myState.item,
  })
  const [youState, setYouState] = useState({
    heart: raingame.youState.heart,
    point: raingame.youState.point,
    item: raingame.youState.item,
  })
  const targetword = useAppSelector((state) => state.raingame.words)
  const targetwordRef = useRef(targetword)
  const [dheart, setDheart] = useState(false)
  const myExtraSpeedRef = useRef(0)
  const youExtraSpeedRef = useRef(0)
  const me = useAppSelector((state) => state.raingame.me)
  const [myImage, setMyImage] = useState(false)
  const [youImage, setYouImage] = useState(false)
  const [gameInProgress, setGameInProgress] = useState(true)

  const hideMyImage = useCallback(() => {
    setMyImage(false)
  }, [])

  const hideYouImage = useCallback(() => {
    setYouImage(false)
  }, [])

  // 승리자 체크

  const WinnerCheck = () => {
    // 상대가 나갔을 때
    if (you.username === '') {
      bootstrap.gameNetwork.endGame(me.username);

      // 둘 중 하나의 heart가 0일 때
    } else if (youState.heart === 0 || myState.heart === 0) {
      if (youState.heart === 0) {
        bootstrap.gameNetwork.endGame(me.username);
      } else if (myState.heart === 0) {
        bootstrap.gameNetwork.endGame(you.username);
      }

      // 시간이 0이 되었을 때
    } else if (time === 0) {
      console.log("시간 0 감지");
      if (myState.point > youState.point) {
        console.log("나의 승리 조건 만족");
        bootstrap.gameNetwork.endGame(
          me.username
        )
      } else if (myState.point < youState.point) {
        bootstrap.gameNetwork.endGame(
          me.username
        )
      } else {
        bootstrap.gameNetwork.endGame('draw')
      }
    }
  }

  const handleClose = () => {
    try {
      bootstrap.gameNetwork.leaveGameRoom()
      dispatch(closeRainGameDialog())
      dispatch(setDialogStatus(DIALOG_STATUS.IN_MAIN))
    } catch (error) {
      console.error('Error leaving the room:', error)
    }
  }

  const Awords = [
    { y: 0, speed: 1.7, keyword: 'computer', x: 190, itemA: false, itemB: true },
    { y: 0, speed: 1.5, keyword: 'code', x: 240, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'program', x: 280, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'button', x: 320, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'screen', x: 360, itemA: true, itemB: false },
    { y: 0, speed: 1.9, keyword: 'click', x: 400, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'type', x: 440, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'game', x: 480, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'save', x: 220, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'picture', x: 260, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'sound', x: 310, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'play', x: 350, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'stop', x: 390, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'go', x: 430, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'back', x: 470, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'web', x: 210, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'internet', x: 250, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'link', x: 290, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'password', x: 330, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'mouse', x: 370, itemA: false, itemB: true },
    { y: 0, speed: 1.9, keyword: 'keyboard', x: 410, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'app', x: 450, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'scroll', x: 200, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'drag', x: 240, itemA: true, itemB: false },
    { y: 0, speed: 1.7, keyword: 'drop', x: 280, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'zoom', x: 320, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'chat', x: 360, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'emoji', x: 400, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'video', x: 440, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'download', x: 220, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'attachment', x: 260, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'backup', x: 300, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'bluetooth', x: 340, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'bold', x: 380, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'bullet', x: 420, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'cache', x: 210, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'compress', x: 250, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'dashboard', x: 290, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'edit', x: 330, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'encrypt', x: 370, itemA: false, itemB: true },
    { y: 0, speed: 1.5, keyword: 'filter', x: 410, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'firewall', x: 450, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'flash drive', x: 200, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'folder', x: 240, itemA: true, itemB: false },
    { y: 0, speed: 1.9, keyword: 'graph', x: 280, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'hacker', x: 320, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'hyperlink', x: 360, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'italic', x: 400, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'logout', x: 440, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'mute', x: 480, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'plugin', x: 220, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'preview', x: 260, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'reboot', x: 300, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'scroll', x: 340, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'template', x: 380, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'thumbnail', x: 420, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'toggle', x: 460, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'username', x: 220, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'volume', x: 260, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'wiFi', x: 300, itemA: false, itemB: false },
  ]
  const Bwords = [
    { y: 0, speed: 1.9, keyword: 'upload', x: 170, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'folder', x: 210, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'file', x: 260, itemA: true, itemB: false },
    { y: 0, speed: 1.9, keyword: 'cut', x: 310, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'copy', x: 350, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'paste', x: 390, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'print', x: 430, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'camera', x: 470, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'microphone', x: 190, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'speaker', x: 230, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'text', x: 270, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'font', x: 310, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'color', x: 350, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'paint', x: 390, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'draw', x: 430, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'icon', x: 470, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'search', x: 210, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'window', x: 250, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'minimize', x: 290, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'maximize', x: 330, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'close', x: 370, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'refresh', x: 410, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'sign in', x: 450, itemA: true, itemB: false },
    { y: 0, speed: 1.5, keyword: 'sign out', x: 190, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'username', x: 230, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'error', x: 270, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'pop-up', x: 310, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'menu', x: 350, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'settings', x: 390, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'tab', x: 430, itemA: false, itemB: true },
    { y: 0, speed: 1.9, keyword: 'animation', x: 470, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'bookmark', x: 210, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'browser', x: 250, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'checkbox', x: 290, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'cursor', x: 330, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'desktop', x: 370, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'highlight', x: 410, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'home page', x: 450, itemA: false, itemB: true },
    { y: 0, speed: 1.5, keyword: 'inbox', x: 190, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'install', x: 230, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'uninstall', x: 270, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'laptop', x: 310, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'network', x: 350, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'offline', x: 390, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'online', x: 430, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'password', x: 470, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'profile', x: 210, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'scrollbar', x: 250, itemA: true, itemB: false },
    { y: 0, speed: 1.9, keyword: 'screenshot', x: 290, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'shortcut', x: 330, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'sidebar', x: 370, itemA: false, itemB: true },
    { y: 0, speed: 1.9, keyword: 'slider', x: 410, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'spam', x: 450, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'taskbar', x: 190, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'toolbar', x: 230, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'trash', x: 270, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'undo', x: 310, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'wallpaper', x: 350, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'widget', x: 390, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'wireless', x: 430, itemA: false, itemB: false },
  ]
  const debouncedDecreaseHeart = debounce(() => {
    bootstrap.gameNetwork.decreaseHeart(sessionId)
  }, 300)
  useEffect(() => {
    const updateMyWordsInterval = setInterval(() => {
      if (!gameInProgress) {
        clearInterval(updateMyWordsInterval)
        return
      }

      setMyGame((game) =>
        game.reduce((newGame, item) => {
          const newY = item.y + item.speed + myExtraSpeedRef.current

          if (newY >= lineHeight && !dheart) {
            debouncedDecreaseHeart()
            setDheart(true)
            if (myState.heart === 0) {
              bootstrap.gameNetwork.startRainGame();
            }
          } else {
            newGame.push({ ...item, y: newY })
          }
          return newGame
        }, [])
      )
    }, 100)
    const meItemInterval = setInterval(() => {
      if (!gameInProgress) {
        clearInterval(meItemInterval)
        return
      }
      if (myState.item && myState.item.length > 0) {
        ItemToMe(myState.item[0])
        setMyState((prevState) => {
          // prevState.item 이 배열인 경우에만 slice 메서드를 사용
          const newItem = Array.isArray(prevState.item) ? prevState.item.slice(1) : []
          bootstrap.gameNetwork.useItem('NA')
          return { ...prevState, item: newItem }
        })
      }
    }, 300)
    const updateYouWordsInterval = setInterval(() => {
      if (!gameInProgress) {
        clearInterval(updateYouWordsInterval)
        return
      }
      setYouGame((game) =>
        game.reduce((newGame, item) => {
          const newY = item.y + item.speed + youExtraSpeedRef.current

          if (targetwordRef.current.length > 0 && targetwordRef.current === item.keyword) {
          } else if (newY < lineHeight) {
            newGame.push({ ...item, y: newY })
          }
          return newGame
        }, [])
      )
    }, 100)

    const youItemInterval = setInterval(() => {
      if (!gameInProgress) {
        clearInterval(youItemInterval)
        return
      }
      if (youState.item && youState.item.length > 0) {
        ItemToYou(youState.item[0])
        setYouState((prevState) => {
          // prevState.item 이 배열인 경우에만 slice 메서드를 사용
          const newItem = Array.isArray(prevState.item) ? prevState.item.slice(1) : []
          bootstrap.gameNetwork.useItem('NA')
          return { ...prevState, item: newItem }
        })
      }
    }, 300)

    

    return () => {
      clearInterval(updateYouWordsInterval)
      clearInterval(youItemInterval)
      clearInterval(updateMyWordsInterval)
      clearInterval(meItemInterval)
    }
  }, [raingame])

  useEffect(() => {
    setMyState({
      heart: raingame.myState.heart,
      point: raingame.myState.point,
      item: raingame.myState.item,
    })
    setDheart(false)
    setYouState({
      heart: raingame.youState.heart,
      point: raingame.youState.point,
      item: raingame.youState.item,
    })
  }, [raingame])

  useEffect(() => {
    targetwordRef.current = targetword
  }, [targetword])

  useEffect(() => {
    let currentWordIndex = 0
    const mywords = username === host ? Awords : Bwords
    const youWords = username === host ? Bwords : Awords

    const createWordsInterval = setInterval(() => {
      if (!gameInProgress) {
        clearInterval(createWordsInterval)
        return
      }
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

    // 시간 측정
    const timeInterval = setInterval(() => {  
      setTime((prevTime) => Math.max(prevTime - 1, 0))
      if (time === 0 ) {
        bootstrap.gameNetwork.startRainGame();
      } 
    }, 1000)

    return () => {
      clearInterval(timeInterval)
      clearInterval(createWordsInterval)
    }
  }, [])

  const keydown = (evnet: KeyboardEvent) => {
    if (event.key === 'Enter' && keywordInput.current) {
      const inputKeyword = keywordInput.current.value
      const MyWord = myGame.find((word) => word.keyword === inputKeyword)
      if (MyWord) {
        setMyGame((prevGame) => prevGame.filter((word) => word.keyword !== inputKeyword))
        bootstrap.gameNetwork.removeWord(inputKeyword, sessionId, raingame)

        if (MyWord.itemA) {
          bootstrap.gameNetwork.useItem('A')
        }
        if (MyWord.itemB) {
          bootstrap.gameNetwork.useItem('B')
        }
      } else {
        /* for 지원 : 입력이 틀렸을 때 로직 넣는 곳 */
      }
      keywordInput.current.value = ''
    }
  }

  const ItemToMe = (item) => {
    switch (item) {
      case 'A':
        // extraSpeed를 2로 설정
        myExtraSpeedRef.current = 5

        // 5초 후에 extraSpeed를 0으로 되돌리기
        setTimeout(() => {
          myExtraSpeedRef.current = 0
        }, 5000)
        break
      case 'B':
        setMyImage(true)
        break
      // ... 다른 케이스들
    }
  }

  const ItemToYou = (item) => {
    switch (item) {
      case 'A':
        // extraSpeed를 2로 설정
        youExtraSpeedRef.current = 5

        // 5초 후에 extraSpeed를 0으로 되돌리기
        setTimeout(() => {
          youExtraSpeedRef.current = 0
        }, 5000)
        break
      case 'B':
        setYouImage(true)
        break
      // ... 다른 케이스들
    }
  }

  // 친구 목숨, 내 목숨 표시

  let friendLifeElements = []
  let myLifeElements = []

  for (let i = 0; i < youState.heart; i++) {
    friendLifeElements.push(
      <img key={{ i }} src={eraser} width="50px" style={{ margin: '5px' }}></img>
    )
  }

  for (let i = 0; i < myState.heart; i++) {
    myLifeElements.push(
      <img key={{ i }} src={eraser} width="50px" style={{ margin: '5px' }}></img>
    )
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
          <Comment>
              <p className={`friend-comment ${you.username ? '' : 'start-game'}`}>
                {you.username ? '친구가 들어왔어요,' : '친구가 아직 들어오지 않았어요 !'}
                <br />
                {you.username ? '방장은 Start 버튼을 눌러주세요 !' : '친구가 들어와야 게임이 시작돼요.'}
              </p>
          </Comment>
        </TimerArea>

        <Left>
          <RainGameItemB show={youImage} onHide={hideYouImage} />
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
          <RainGameItemB show={myImage} onHide={hideMyImage} />
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
            <img src={ friendimgpath } width="50px" id="friend-character"></img>
          </CharacterArea>
          <NameArea>
            친구 [{you.username.toUpperCase()}] <br />
            {friendLifeElements}
          </NameArea>
        </FriendPoint>



        <PlayArea>
          <Item>
            💡 특별한 색의 단어를 성공하면 아이템을 사용할 수 있어요 !<br/><br/>
            <span style={{ color: 'red' }}>빨간색</span> - 상대방 단어 가리기<br/>
            <span style={{ color: 'blue' }}>파란색</span> - 상대방 속도 키우기
          </Item>
        </PlayArea>


        <InputArea>
          <Position>
            {youState.point}:{myState.point}
          </Position>
        </InputArea>

        <PlayArea>
          <div>

            명령어를 입력한 후 엔터를 쳐주세요 !
            <TextField
                focused
                inputRef={keywordInput}
                onKeyPress={(e) => keydown(e.charCode)}
                fullWidth
                InputProps={{
                  style: {
                    width: '300px',
                    marginTop: '5px',
                  },
                }}
            />
            <button onClick={() => keydown(13)} style={{ display: 'none' }}></button>
          </div>
        </PlayArea>

        <MyPoint>
          <NameArea>
            나 [{username.toUpperCase()}]<br />
            {myLifeElements}
          </NameArea>
          <CharacterArea>
            <img src={ imgpath } width="50px" id="my-character"></img>
          </CharacterArea>
        </MyPoint>
      </PointArea>
    </>
  )
}
export default RainGame
