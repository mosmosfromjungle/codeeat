import React, { useState } from 'react'
import styled from 'styled-components'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

import { IGameRoomData, RoomType } from '../../../../types/Rooms'
import { useAppSelector, useAppDispatch } from '../../hooks'
import { DIALOG_STATUS, setDialogStatus } from '../../stores/UserStore'

import phaserGame from '../../PhaserGame'
import Bootstrap from '../../scenes/Bootstrap'

const CreateRoomFormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  width: 320px;
  gap: 20px;
`

const RoomButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  Button {
    font-size: 20px;
    font-family: Font_DungGeun;
  }
`

export const CreateRoomForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [nameFieldEmpty, setNameFieldEmpty] = useState(false)
  const [descriptionFieldEmpty, setDescriptionFieldEmpty] = useState(false)
  const lobbyJoined = useAppSelector((state) => state.room.lobbyJoined)
  const username = useAppSelector((state) => state.user.username)
  const character = useAppSelector((state) => state.user.character)
  const brickGameOpen = useAppSelector((state) => state.brickgame.brickGameOpen)
  const moleGameOpen = useAppSelector((state) => state.molegame.moleGameOpen)
  const rainGameOpen = useAppSelector((state) => state.rainGameDialog.rainGameOpen)
  const codingRunOpen = useAppSelector((state) => state.codingrun.codingRunOpen)

  const dispatch = useAppDispatch()

  const [values, setValues] = useState<IGameRoomData>({
    name: '',
    description: '',
    password: null,
    username: username,
  })

  const handleChange = (prop: keyof IGameRoomData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const isValidName = values.name !== ''
    const isValidDescription = values.description !== ''

    if (isValidName === nameFieldEmpty) setNameFieldEmpty(!nameFieldEmpty)
    if (isValidDescription === descriptionFieldEmpty)
      setDescriptionFieldEmpty(!descriptionFieldEmpty)

    // create custom room if name and description are not empty
    if (isValidName && isValidDescription && lobbyJoined) {
      const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
      try {
        if (brickGameOpen) await bootstrap.gameNetwork.createBrickRoom(values)
        if (moleGameOpen) await bootstrap.gameNetwork.createMoleRoom(values)
        if (rainGameOpen) await bootstrap.gameNetwork.createRainRoom(values)
        if (codingRunOpen) await bootstrap.gameNetwork.createCodingRoom(values)
        dispatch(setDialogStatus(DIALOG_STATUS.GAME_WELCOME))
      } catch (error) {
        console.error(error)
      }
    }
  }

  return (
    <CreateRoomFormWrapper onSubmit={handleSubmit}>
      <TextField
        label="방 이름"
        variant="outlined"
        color="secondary"
        autoFocus
        error={nameFieldEmpty}
        helperText={nameFieldEmpty && '방 이름을 입력해주세요 !'}
        onChange={handleChange('name')}
      />

      <TextField
        label="방 설명"
        variant="outlined"
        color="secondary"
        error={descriptionFieldEmpty}
        helperText={descriptionFieldEmpty && '방 설명을 입력해주세요 !'}
        multiline
        rows={4}
        onChange={handleChange('description')}
      />

      <TextField
        type={showPassword ? 'text' : 'password'}
        label="방 비밀번호 (선택사항)"
        onChange={handleChange('password')}
        color="secondary"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      
      <RoomButton>
        <Button variant="contained" size="large" type="submit">
          만들기
        </Button>
      </RoomButton>
    </CreateRoomFormWrapper>
  )
}