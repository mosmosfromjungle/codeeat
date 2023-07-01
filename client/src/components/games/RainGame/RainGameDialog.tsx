import React, { useEffect, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import RainGame from './RainGame'
import { useAppSelector, useAppDispatch } from '../../../hooks'
import { DIALOG_STATUS, setDialogStatus } from '../../../stores/UserStore'
import { closeRainGameDialog } from '../../../stores/RainGameDialogStore'
import phaserGame from '../../../PhaserGame'
import Bootstrap from '../../../scenes/Bootstrap'

import { 
  Backdrop, Wrapper, StartButton, CharacterArea, NameArea, 
  WaitWrapper, FriendInfo, MyInfo, Position, Comment, 

} from './RainGameStyle'

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const RainGameDialog = () => {
  const dispatch = useAppDispatch()
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap

  // My information
  const username = useAppSelector((state) => state.user.username)
  const character = useAppSelector((state) => state.user.character)
  const imgpath = `/assets/character/single/${capitalizeFirstLetter(character)}_idle_anim_19.png`;

  // Friend information
  const you = useAppSelector((state) => state.raingame.you)
  const friendimgpath = `/assets/character/single/${capitalizeFirstLetter(you.character)}_idle_anim_19.png`;

  const isReady = useAppSelector((state) => state.raingame.rainGameReady)
  const inProgress = useAppSelector((state) => state.raingame.rainGameInProgress)
  const sessionId = useAppSelector((state) => state.user.sessionId);
  const host = useAppSelector((state) => state.raingame.host);
  const isHost = username === host;

  bootstrap.gameNetwork.sendMyInfoToServer(username, character)

  const handleStartGame = () => {
    console.log('handleStartGame')
    if(isReady && isHost){
      bootstrap.gameNetwork.startRainGame()
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

  return (
    <Backdrop>
      <Wrapper>
        <IconButton aria-label="close dialog" 
                    className="close" 
                    onClick={ handleClose }>
          <CloseIcon />
        </IconButton>

        { !inProgress && (
          <WaitWrapper>
              <>
                <FriendInfo>
                  { you.username === '' ?
                    (
                      <>
                        <Position>
                          친구
                        </Position>
                      </>
                    )
                  :
                    (
                      <>
                        <Position>
                          친구
                        </Position>
                        <CharacterArea>
                          <img src={ friendimgpath } width="50px" id="friend-character"></img>
                        </CharacterArea>
                        <NameArea>
                          [{you.username.toUpperCase()}]<br/><br/>
                        </NameArea>
                      </>
                    )
                  }
                </FriendInfo>

                <MyInfo>
                  <Position>
                    나
                  </Position>
                  <CharacterArea>
                    <img src={ imgpath } width="50px" id="my-character"></img>
                  </CharacterArea>
                  <NameArea>
                    [{ username.toUpperCase() }]<br/><br/>
                  </NameArea>
                </MyInfo>
              </>
          </WaitWrapper>
        )}

        { !inProgress && (
          <Comment>
            { you.username === '' ?
              (
                <>
                  아직 친구가 들어오지 않았어요 ! <br/>
                  친구가 들어와야 게임을 시작할 수 있어요.
                </>
              )
            :
              (
                <>
                  친구가 들어왔어요, <br/>
                  방장은 시작 버튼을 눌러주세요 !
                </>
              )
            }
          </Comment>
        )}

        { !inProgress && (
          <StartButton onClick={ handleStartGame } disabled={!isReady || !isHost}>
            게임 시작
          </StartButton>
        )}
        
        {inProgress && <RainGame />}
      </Wrapper>
    </Backdrop>
  )
}

export default RainGameDialog
