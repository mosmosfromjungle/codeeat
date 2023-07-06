import React, { useState } from 'react'
import styled from 'styled-components'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Alert from '@mui/material/Alert'

import PeopleAltIcon from '@mui/icons-material/PeopleAlt'

import { useTheme } from '@mui/material/styles';
import CardContent from '@mui/material/CardContent';

import { useAppSelector, useAppDispatch } from '../../hooks'

import phaserGame from '../../PhaserGame'
import Bootstrap from '../../scenes/Bootstrap'
import { DIALOG_STATUS, setDialogStatus } from '../../stores/UserStore'

const GameRoomList = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`

const Card = styled.div`
  background-color: black;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  height: 160px;
  width: 380px;
  margin: 10px;
`

const ImageArea = styled.div`
  width: 110px;
  height: 110px;
  margin-left: 10px;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const TextArea = styled.div`
  display: flex;
  flex-direction: column;
`
  
const TopArea = styled.div`
  height: 50%;
  font-size: 20px;
  font-family: Font_DungGeun;
`
  
const BottomArea = styled.div`
  height: 50%;
  font-size: 20px;
  font-family: Font_DungGeun;
`

const Title = styled.div`
  display: flex;
  align-items: center;
  font-size: 25px;
  font-family: Font_DungGeun;
`

const Description = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  font-family: Font_DungGeun;
`

const Footer = styled.div`
  display: flex;
  align-items: center;
  font-size: 20px;
  background-color: gray;
  border-radius: 5px;
  padding: 0 10px 0 10px;
  margin: 0 5px 0 5px;
  font-family: Font_DungGeun;
`

const MessageText = styled.p`
  margin: 30px;
  color: #eee;
  text-align: center;
  font-size: 25px;
  font-family: Font_DungGeun;
`

const PasswordDialog = styled(Dialog)`
  .dialog-content {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .MuiDialog-paper {
    background: #222639;
  }

  Button {
    margin: 10px;
    font-size: 20px;
    font-family: Font_DungGeun;
  }
`

export const CustomRoomTable = (props) => {
  console.log('props: '+props);
  console.log('props.type: '+props.type);

  const [password, setPassword] = useState('')
  const [selectedRoom, setSelectedRoom] = useState('')
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [showPasswordError, setShowPasswordError] = useState(false)
  const [passwordFieldEmpty, setPasswordFieldEmpty] = useState(false)
  const lobbyJoined = useAppSelector((state) => state.room.lobbyJoined)
  const username = useAppSelector((state) => state.user.username)
  const character = useAppSelector((state) => state.user.character)
  const brickGameOpen = useAppSelector((state) => state.brickgame.brickGameOpen)
  const moleGameOpen = useAppSelector((state) => state.molegame.moleGameOpen)
  // const faceChatOpen = useAppSelector((state) => state.facechat.faceChatOpen)
  const rainGameOpen = useAppSelector((state) => state.rainGameDialog.rainGameOpen)
  
  const availableRooms = useAppSelector((state) => {
    if (brickGameOpen) return state.room.availableRooms.brickRooms
    if (moleGameOpen) return state.room.availableRooms.moleRooms
    if (rainGameOpen) return state.room.availableRooms.rainRooms
    // if (faceChatOpen) return state.room.availableRooms.faceChatRooms
    return []
  })

  const dispatch = useAppDispatch()

  const handleJoinClick = (roomId: string, password: string | null) => {
    if (!lobbyJoined) return
    const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
    bootstrap.gameNetwork.joinCustomById(roomId, password, username, character).then(() => {
      dispatch(setDialogStatus(DIALOG_STATUS.IN_GAME))
    }).catch((error) => {
        console.error(error)
        if (password) setShowPasswordError(true)
    })
  }

  const handlePasswordSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const isValidPassword = password !== ''

    if (isValidPassword === passwordFieldEmpty) setPasswordFieldEmpty(!passwordFieldEmpty)
    if (isValidPassword) handleJoinClick(selectedRoom, password)
  }

  const resetPasswordDialog = () => {
    setShowPasswordDialog(false)
    setPassword('')
    setPasswordFieldEmpty(false)
    setShowPasswordError(false)
  }

  const theme = useTheme();

  return availableRooms.length === 0 ? (
    <MessageText>
      아직 만들어진 방이 없어요. 방을 만들어 친구들과 게임을 시작하세요 !
    </MessageText>
  ) : (
    <>
      <GameRoomList>
        {availableRooms.map((room) => {
          const { roomId, metadata, clients } = room
          const { name, description, hasPassword } = metadata
          return (
            <Button 
              sx={{ width: '50%' }} 
              disabled={ clients === 2 }
              onClick={() => {
                if (hasPassword) {
                  setShowPasswordDialog(true)
                  setSelectedRoom(roomId)
                } else {
                  handleJoinClick(roomId, null)
                }
              }}
            >
              <Card>
                <ImageArea>
                  <img
                    src="/assets/game/common/thumbnail_mole.png"
                    style={{ width: '100%', height: '100%', borderRadius: '20px', backgroundColor: 'green' }}
                  />
                </ImageArea>

                <TextArea>
                  <CardContent style={{ flex: '1 0 auto' }}>
                    <TopArea>
                      <Title>{name}</Title>
                      <Description>{description}</Description>
                    </TopArea>

                    <BottomArea>
                      <hr style={{ width: '220px' }} />
                      <div style={{ display: 'flex' }}>
                        <Footer style={{ color: 'yellow' }}>{clients === 2 ? 'Playing' : 'Waiting'}</Footer>
                        <Footer><PeopleAltIcon />{clients}/2</Footer>
                      </div>
                    </BottomArea>
                  </CardContent>
                </TextArea>
              </Card>
            </Button>
          )
        })}
      </GameRoomList>
      <PasswordDialog open={showPasswordDialog} onClose={resetPasswordDialog}>
        <form onSubmit={handlePasswordSubmit}>
          <DialogContent className="dialog-content">
            <MessageText>이 방에는 비밀번호가 걸려있네요. <br/>비밀번호를 입력해주세요 !</MessageText>
            <TextField
              autoFocus
              fullWidth
              error={passwordFieldEmpty}
              helperText={passwordFieldEmpty && 'Required'}
              value={password}
              label="비밀번호"
              type="password"
              variant="outlined"
              color="secondary"
              onInput={(e) => {
                setPassword((e.target as HTMLInputElement).value)
              }}
            />
            {showPasswordError && (
              <Alert severity="error" variant="outlined">
                올바르지 않은 비밀번호입니다.
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button color="secondary" type="submit">
              입장하기
            </Button>
            <Button color="secondary" onClick={resetPasswordDialog}>
              취소하기
            </Button>
          </DialogActions>
        </form>
      </PasswordDialog>
    </>
  )
}