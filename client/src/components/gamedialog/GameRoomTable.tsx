import React, { useState } from 'react'
import styled from 'styled-components'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import Tooltip from '@mui/material/Tooltip'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import LockIcon from '@mui/icons-material/Lock'

import { useAppSelector, useAppDispatch } from '../../hooks'
import { getAvatarString, getColorByString } from '../../util'

import phaserGame from '../../PhaserGame'
import Bootstrap from '../../scenes/Bootstrap'
import { DIALOG_STATUS, setDialogStatus } from '../../stores/UserStore'

const MessageText = styled.p`
  margin: 10px;
  color: #eee;
  text-align: center;
  font-size: 20px;
  font-family: Font_DungGeun;
`

const CustomRoomTableContainer = styled(TableContainer) <{component: React.ElementType}>`
  max-height: 500px;

  table {
    min-width: 650px;
  }
`

const TableRowWrapper = styled(TableRow)`
  &:last-child td,
  &:last-child th {
    border: 0;
    font-size: 15px;
    font-family: Font_DungGeun;
  }

  .avatar {
    height: 30px;
    width: 30px;
    font-size: 20px;
    font-family: Font_DungGeun;
  }

  .name {
    min-width: 100px;
    overflow-wrap: anywhere;
  }

  .description {
    min-width: 120px;
    overflow-wrap: anywhere;
  }

  .join-wrapper {
    display: flex;
    gap: 3px;
    align-items: center;
  }

  .lock-icon {
    font-size: 18px;
  }
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
`

const JoinButton = styled.div`
  Button {
    font-size: 15px;
    font-family: Font_DungGeun;
  }
`

export const CustomRoomTable = () => {
  const [password, setPassword] = useState('')
  const [selectedRoom, setSelectedRoom] = useState('')
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [showPasswordError, setShowPasswordError] = useState(false)
  const [passwordFieldEmpty, setPasswordFieldEmpty] = useState(false)
  const lobbyJoined = useAppSelector((state) => state.room.lobbyJoined)
  const userName = useAppSelector((state) => state.user.userName)
  const character = useAppSelector((state) => state.user.character)
  const brickGameOpen = useAppSelector((state) => state.brickgame.brickGameOpen)
  const moleGameOpen = useAppSelector((state) => state.molegame.moleGameOpen)
  const faceChatOpen = useAppSelector((state) => state.facechat.faceChatOpen)
  const rainGameOpen = useAppSelector((state) => state.rainGameDialog.rainGameOpen)
  const availableRooms = useAppSelector((state) => {
    if (brickGameOpen) return state.room.availableRooms.brickRooms
    if (moleGameOpen) return state.room.availableRooms.moleRooms
    if (rainGameOpen) return state.room.availableRooms.rainRooms
    if (faceChatOpen) return state.room.availableRooms.faceChatRooms
    return []
  })

  const dispatch = useAppDispatch()

  const handleJoinClick = (roomId: string, password: string | null) => {
    if (!lobbyJoined) return
    const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
    bootstrap.gameNetwork.joinCustomById(roomId, password, username).then(() => {
      dispatch(setDialogStatus(DIALOG_STATUS.GAME_WELCOME))
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

  return availableRooms.length === 0 ? (
    <MessageText>
      아직 만들어진 방이 없어요. 방을 만들어 친구들과 게임을 시작하세요 !
    </MessageText>
    ) : (
    <>
      <CustomRoomTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRowWrapper>
              <TableCell></TableCell>
              <TableCell>방 이름</TableCell>
              <TableCell>방 설명</TableCell>
              <TableCell>만든 사람</TableCell>
              <TableCell align="center">
                <PeopleAltIcon />
              </TableCell>
              <TableCell align="right"></TableCell>
            </TableRowWrapper>
          </TableHead>
          <TableBody>
            {availableRooms.map((room) => {
              const { roomId, metadata, clients } = room
              const { name, description, hasPassword } = metadata
              return (
                <TableRowWrapper key={roomId}>
                  <TableCell>
                    <Avatar className="avatar" style={{ background: getColorByString(name) }}>
                      {getAvatarString(name)}
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div className="name">{name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="description">{description}</div>
                  </TableCell>
                  <TableCell>{roomId}</TableCell>
                  <TableCell align="center">{clients}</TableCell>
                  <TableCell align="center">
                    <Tooltip title={hasPassword ? 'Password required' : ''}>
                      <JoinButton>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => {
                            if (hasPassword) {
                              setShowPasswordDialog(true)
                              setSelectedRoom(roomId)
                            } else {
                              handleJoinClick(roomId, null)
                            }
                          }}
                        >
                          <div className="join-wrapper">
                            {hasPassword && <LockIcon className="lock-icon" />}
                            참여하기
                          </div>
                        </Button>
                      </JoinButton>
                    </Tooltip>
                  </TableCell>
                </TableRowWrapper>
              )
            })}
          </TableBody>
        </Table>
      </CustomRoomTableContainer>
      <PasswordDialog open={showPasswordDialog} onClose={resetPasswordDialog}>
        <form onSubmit={handlePasswordSubmit}>
          <DialogContent className="dialog-content">
            <MessageText>This a private room, please enter password:</MessageText>
            <TextField
              autoFocus
              fullWidth
              error={passwordFieldEmpty}
              helperText={passwordFieldEmpty && 'Required'}
              value={password}
              label="Password"
              type="password"
              variant="outlined"
              color="secondary"
              onInput={(e) => {
                setPassword((e.target as HTMLInputElement).value)
              }}
            />
            {showPasswordError && (
              <Alert severity="error" variant="outlined">
                Incorrect Password!
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={resetPasswordDialog}>
              Cancel
            </Button>
            <Button color="secondary" type="submit">
              Join
            </Button>
          </DialogActions>
        </form>
      </PasswordDialog>
    </>
  )
}