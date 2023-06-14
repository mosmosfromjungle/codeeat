import React from 'react'
import styled from 'styled-components'

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { useAppSelector, useAppDispatch } from '../hooks'
import { setShowLogout } from '../stores/UserStore'

export default function AlertDialog() {
  const showLogout = useAppSelector((state) => state.user.showLogout)

  const dispatch = useAppDispatch()

  const handleClose = () => {
    dispatch(setShowLogout(false))
  };

  return (
    <div>
      <Dialog
        open={showLogout}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Logout AlgoEAT"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            정말 로그아웃 하시겠어요 ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>예</Button>
          <Button onClick={handleClose}>아니요</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
