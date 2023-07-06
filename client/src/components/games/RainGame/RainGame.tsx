import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import Bootstrap from '../../../scenes/Bootstrap'
import phaserGame from '../../../PhaserGame'

import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import {
  CharacterArea,
  NameArea,
  Position,
  TimerArea,
  GameArea,
  Left,
  Right,
  PointArea,
  FriendPoint,
  MyPoint,
  InputArea,
  PlayArea,
  Comment,
  StartButton,
  Item,
} from './RainGameStyle'
import './RainGame.css'

import eraser from '/assets/game/RainGame/eraser.png'

import debounce from 'lodash/debounce'
import RainGameItemB from './RainGameItemB'

import { DIALOG_STATUS, setDialogStatus } from '../../../stores/UserStore'
import { closeRainGameDialog } from '../../../stores/RainGameDialogStore'

import { updateLevel, UpdateLevelReqest } from '../../../apicalls/auth'
import ExperienceResultModal from '../../ExperienceResultModal'

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
  const rainGameInProgress = useAppSelector((state) => state.raingame.rainGameInProgress)
  const rainGameInProgressRef = useRef(rainGameInProgress)
  const rainGameReady = useAppSelector((state) => state.raingame.rainGameReady)

  const raingame = useAppSelector((state) => state.raingame)

  const lineHeight = 380
  const dispatch = useAppDispatch()
  const keywordInput = useRef<HTMLInputElement>(null)
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
  const [time, setTime] = useState(100)
  const host = useAppSelector((state) => state.raingame.host)
  const sessionId = useAppSelector((state) => state.user.gameSessionId)
  const gamewinner = useAppSelector((state) => state.raingame.winner)
  

  // My information
  const username = useAppSelector((state) => state.user.username)
  const character = useAppSelector((state) => state.user.character)
  const imgpath = `/assets/character/single/${capitalizeFirstLetter(character)}.png`

  // Friend information
  const you = useAppSelector((state) => state.raingame.you)
  const friendimgpath = `/assets/character/single/${capitalizeFirstLetter(you.character)}.png`
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
  const myExtraSpeedRef = useRef(0)
  const youExtraSpeedRef = useRef(0)
  const me = useAppSelector((state) => state.raingame.me)
  const [myImage, setMyImage] = useState(false)
  const [youImage, setYouImage] = useState(false)

  const hideMyImage = useCallback(() => {
    setMyImage(false)
  }, [])

  const hideYouImage = useCallback(() => {
    setYouImage(false)
  }, [])

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const openModal = () => {
    console.log("openModal:",gamewinner)
    setTimeout(() => {
      setIsModalOpen(true)
    }, 200)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    handleClose()
  }

  // 경험치 보내주기
  const gainExpUpdateLevel = (username: string, exp: number) => {
    const body: UpdateLevelReqest = {
      username: username,
      exp: exp,
    }
    updateLevel(body)
      .then((response) => {
        if (!response) return
      })
      .catch((error) => {
        if (error.response) {
          const { status, message } = error.response.data
        }
      })
  }

  useEffect(() => {
    setMyState({
      heart: raingame.myState.heart,
      point: raingame.myState.point,
      item: raingame.myState.item,
    })
    setYouState({
      heart: raingame.youState.heart,
      point: raingame.youState.point,
      item: raingame.youState.item,
    })
  }, [raingame.myState, raingame.youState])

  useEffect(() => {
    if (gamewinner === username) {
      gainExpUpdateLevel(username, 7)
    } else if (gamewinner === you.username) {
      gainExpUpdateLevel(username, 3)
    }
    if (gamewinner) {
      openModal()
      
    }
  }, [gamewinner])

  const handleClose = () => {
    try {
      bootstrap.gameNetwork.startRainGame(false)
      bootstrap.gameNetwork.leaveGameRoom()
      dispatch(closeRainGameDialog())
      dispatch(setDialogStatus(DIALOG_STATUS.IN_MAIN))
    } catch (error) {
      console.error('Error leaving the room:', error)
    }
  }
/* 오른쪽 x : 60~600 */
  const Awords = [
    { y: 0, speed: 2.1, keyword: 'computer', x: 60, itemA: false, itemB: false },
    { y: 0, speed: 2.4, keyword: 'code', x: 600, itemA: false, itemB: false },
    { y: 0, speed: 2.3, keyword: 'program', x: 60, itemA: false, itemB: false },
    { y: 0, speed: 2.0, keyword: 'button', x: 600, itemA: true, itemB: false },
    { y: 0, speed: 2.1, keyword: 'screen', x: 60, itemA: false, itemB: false },
    { y: 0, speed: 2.1, keyword: 'click', x: 600, itemA: true, itemB: false },
    { y: 0, speed: 2.2, keyword: 'type', x: 60, itemA: false, itemB: true },
    { y: 0, speed: 2.4, keyword: 'game', x: 600, itemA: true, itemB: false },
    { y: 0, speed: 2.3, keyword: 'save', x: 60, itemA: false, itemB: true },
    { y: 0, speed: 2.3, keyword: 'picture', x: 600, itemA: true, itemB: false },
    { y: 0, speed: 2.3, keyword: 'sound', x: 60, itemA: true, itemB: false },
    { y: 0, speed: 2.3, keyword: 'play', x: 600, itemA: false, itemB: true },
    { y: 0, speed: 2.3, keyword: 'stop', x: 60, itemA: true, itemB: false },
    { y: 0, speed: 2.4, keyword: 'go', x: 600, itemA: true, itemB: true },
    { y: 0, speed: 1.9, keyword: 'back', x: 60, itemA: false, itemB: false },
    { y: 0, speed: 2.0, keyword: 'web', x: 600, itemA: false, itemB: false },
    { y: 0, speed: 2.1, keyword: 'internet', x: 60, itemA: true, itemB: false },
    { y: 0, speed: 2.3, keyword: 'link', x: 600, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'password', x: 60, itemA: true, itemB: false },
    { y: 0, speed: 1.5, keyword: 'mouse', x: 600, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'keyboard', x: 410, itemA: true, itemB: false },
    { y: 0, speed: 1.7, keyword: 'app', x: 450, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'scroll', x: 200, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'drag', x: 240, itemA: false, itemB: false },
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
    { y: 0, speed: 1.5, keyword: 'folder', x: 240, itemA: false, itemB: false },
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
    { y: 0, speed: 3.9, keyword: 'upload', x: 100, itemA: false, itemB: false },
    { y: 0, speed: 3.7, keyword: 'folder', x: 200, itemA: false, itemB: true },
    { y: 0, speed: 3.5, keyword: 'file', x: 200, itemA: false, itemB: false },
    { y: 0, speed: 3.9, keyword: 'cut', x: 200, itemA: false, itemB: true },
    { y: 0, speed: 3.7, keyword: 'copy', x: 378, itemA: false, itemB: false },
    { y: 0, speed: 3.5, keyword: 'paste', x: 420, itemA: false, itemB: false },
    { y: 0, speed: 3.9, keyword: 'print', x: 489, itemA: false, itemB: false },
    { y: 0, speed: 3.7, keyword: 'camera', x: 444, itemA: false, itemB: true },
    { y: 0, speed: 3.5, keyword: 'microphone', x: 430, itemA: false, itemB: false },
    { y: 0, speed: 3.9, keyword: 'speaker', x: 350, itemA: false, itemB: false },
    { y: 0, speed: 3.7, keyword: 'text', x: 225, itemA: false, itemB: false },
    { y: 0, speed: 3.5, keyword: 'font', x: 432, itemA: false, itemB: false },
    { y: 0, speed: 3.9, keyword: 'color', x: 350, itemA: false, itemB: false },
    { y: 0, speed: 3.7, keyword: 'paint', x: 390, itemA: false, itemB: false },
    { y: 0, speed: 3.5, keyword: 'draw', x: 430, itemA: false, itemB: false },
    { y: 0, speed: 3.9, keyword: 'icon', x: 470, itemA: false, itemB: false },
    { y: 0, speed: 2.7, keyword: 'search', x: 210, itemA: false, itemB: false },
    { y: 0, speed: 2.5, keyword: 'window', x: 250, itemA: false, itemB: false },
    { y: 0, speed: 2.9, keyword: 'minimize', x: 290, itemA: false, itemB: false },
    { y: 0, speed: 2.7, keyword: 'maximize', x: 330, itemA: false, itemB: false },
    { y: 0, speed: 2.5, keyword: 'close', x: 370, itemA: false, itemB: false },
    { y: 0, speed: 2.9, keyword: 'refresh', x: 410, itemA: false, itemB: false },
    { y: 0, speed: 2.7, keyword: 'sign in', x: 450, itemA: false, itemB: false },
    { y: 0, speed: 2.5, keyword: 'sign out', x: 190, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'username', x: 230, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'error', x: 270, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'pop-up', x: 310, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'menu', x: 350, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'settings', x: 390, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'tab', x: 430, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'animation', x: 470, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'bookmark', x: 210, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'browser', x: 250, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'checkbox', x: 290, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'cursor', x: 330, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'desktop', x: 370, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'highlight', x: 410, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'home page', x: 450, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'inbox', x: 190, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'install', x: 230, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'uninstall', x: 270, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'laptop', x: 310, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'network', x: 350, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'offline', x: 390, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'online', x: 430, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'password', x: 470, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'profile', x: 210, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'scrollbar', x: 250, itemA: false, itemB: false },
    { y: 0, speed: 1.9, keyword: 'screenshot', x: 290, itemA: false, itemB: false },
    { y: 0, speed: 1.7, keyword: 'shortcut', x: 330, itemA: false, itemB: false },
    { y: 0, speed: 1.5, keyword: 'sidebar', x: 370, itemA: false, itemB: false },
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
      if (!rainGameInProgressRef.current) {
        clearInterval(updateMyWordsInterval)
        return
      }

      // 내 단어 생성, 위치 업데이트
      setMyGame((game) =>
        game.reduce((newGame, item) => {
          const newY = item.y + item.speed + myExtraSpeedRef.current
          if (newY >= lineHeight) {
            console.log("목숨 깎임")
            debouncedDecreaseHeart()

            if (myState.heart <= 0) {
              console.log("목숨 0되는거 감지됨")
              bootstrap.gameNetwork.endGame(you.username)
            }
          } else {
            newGame.push({ ...item, y: newY })
          }
          return newGame
        }, [])
      )
    }, 100)

    const meItemInterval = setInterval(() => {
      if (!rainGameInProgressRef.current) {
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
      if (!rainGameInProgressRef.current) {
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
      if (!rainGameInProgressRef.current) {
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
    targetwordRef.current = targetword
  }, [targetword])

  useEffect(() => {
    rainGameInProgressRef.current = rainGameInProgress
  }, [rainGameInProgress])

  useEffect(() => {
    // 아직 준비상태면, 단어 떨어지지 않음
    if (!rainGameInProgressRef.current || !rainGameReady) {
      return
    }

    let currentWordIndex = 0
    const mywords = username === host ? Awords : Bwords
    const youWords = username === host ? Bwords : Awords

    const createWordsInterval = setInterval(() => {
      if (!rainGameInProgressRef.current) {
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
      setTime((prevTime) => {
        const newTime = Math.max(prevTime - 1, 0)
        if (newTime === 0) {
          if (myState.point > youState.point) {
            bootstrap.gameNetwork.endGame(me.username)
          } else if (myState.point === youState.point) {
            bootstrap.gameNetwork.endGame('draw')
          }
        }
        return newTime
      })
    }, 1000)

    return () => {
      clearInterval(timeInterval)
      clearInterval(createWordsInterval)
    }
  }, [rainGameInProgressRef.current])

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
        }, 7000)
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
        youExtraSpeedRef.current = 4

        // 5초 후에 extraSpeed를 0으로 되돌리기
        setTimeout(() => {
          youExtraSpeedRef.current = 0
        }, 7000)
        break
      case 'B':
        setYouImage(true)
        break
      // ... 다른 케이스들
    }
  }

  const handleStart = () => {
    if (rainGameReady) {
      bootstrap.gameNetwork.startRainGame(true)
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

  for (let j = 0; j < myState.heart; j++) {
    myLifeElements.push(<img key={{ j }} src={eraser} width="50px" style={{ margin: '5px' }}></img>)
  }

  return (
    <>
      <GameArea>
        {isModalOpen && <ExperienceResultModal open={isModalOpen} handleClose={closeModal} winner={ gamewinner === username} />}
        {!rainGameInProgressRef.current && (
          <Comment>
            <p
              className={`friend-comment ${
                you.username && !rainGameInProgressRef.current ? '' : 'start-game'
              }`}
            >
              {you.username ? '친구가 들어왔어요,' : '친구가 아직 들어오지 않았어요 !'}
              <br />
              {you.username
                ? '방장은 Start 버튼을 눌러주세요 !'
                : '친구가 들어와야 게임이 시작돼요.'}
            </p>
          </Comment>
        )}

        {you.username && !rainGameInProgressRef.current && username === host ? (
          <StartButton>
            <div id="start-button-div">
              <div className="btn-wrap">
                <Button
                  type="button"
                  onClick={() => handleStart()}
                  style={{
                    position: 'absolute',
                    fontSize: '20px',
                    fontFamily: 'Font_DungGeun',
                    width: '160px',
                    background: 'white',
                    color: 'black',
                    top: '0px',
                    right: '80px',
                    borderRadius: '20px',
                    zIndex: 3,
                  }}
                >
                  게임 시작
                </Button>
              </div>
            </div>
          </StartButton>
        ) : (
          ''
        )}

        <TimerArea>
          {time < 16 ? (
            <>
              <div id="timer" style={{ color: 'red' }}>
                {String(time).padStart(3, '0')}
              </div>
            </>
          ) : (
            <>
              <div id="timer">{String(time).padStart(3, '0')}</div>
            </>
          )}
        </TimerArea>

        <Left>
          <RainGameItemB show={youImage} onHide={hideYouImage} />
          {youGame.map((word, index) => (
            <h5
              key={index}
              style={{
                position: 'absolute',
                fontSize: '50px',
                letterSpacing: '0.1vw',
                top: `${word.y}px`,
                left: `${word.x}px`,
                color: word.itemA ? 'red' : (word.itemB ? 'blue' : '#FFFFFF'),
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
                fontSize: '50px',
                letterSpacing: '0.1vw',
                top: `${word.y}px`,
                left: `${word.x + 60}px`,
                color: word.itemA ? 'red' : (word.itemB ? 'blue' : '#FFFFFF'),
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
            <img
              src={friendimgpath}
              width="50px"
              id="friend-character"
              className={you.username ? '' : 'hidden'}
            ></img>
          </CharacterArea>
          <NameArea>
            친구 [{you.username.toUpperCase()}] <br />
            {friendLifeElements}
          </NameArea>
        </FriendPoint>

        <PlayArea>
          <Item>
            💡 특별한 색의 단어를 성공하면 아이템을 사용할 수 있어요 !<br />
            <br />
            <span style={{ color: 'red' }}>빨간색</span> - 상대방 속도 키우기
            <br />
            <span style={{ color: 'blue' }}>파란색</span> - 상대방 단어 가리기
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
              autoComplete='off'
              InputProps={{
                style: {
                  width: '300px',
                  marginTop: '10px',
                },
              }}
            />
            <button onClick={() => keydown(13)} style={{ display: 'none' }}></button>
          </div>
        </PlayArea>

        <MyPoint>
          <NameArea>
            <span style={{ color: 'yellow' }}>나</span> [{username.toUpperCase()}]<br />
            {myLifeElements}
          </NameArea>
          <CharacterArea>
            <img src={imgpath} width="50px" id="my-character"></img>
          </CharacterArea>
        </MyPoint>
      </PointArea>
    </>
  )
}
export default RainGame
