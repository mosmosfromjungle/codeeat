import express from 'express'
import { authenticateToken } from '../controllers/UserControllers/index'
import {
  getFriendsList,
  getFriendRequests,
  sendFriendRequest,
  cancelFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
} from '../controllers/FriendsControllers/index'

express().use(express.json()) 

const router = express.Router()

router.get('/list', authenticateToken, getFriendsList)

router.get('/request/list', authenticateToken, getFriendRequests)

router.post('/request', authenticateToken, sendFriendRequest)

router.delete('/request/cancel', authenticateToken, cancelFriendRequest)

router.put('/request/accept', authenticateToken, acceptFriendRequest)

router.put('/request/reject', authenticateToken, rejectFriendRequest)

router.delete('/remove', authenticateToken, removeFriend)

router.use((err, res) => {
  console.error(err)
  res.status(500).json({
    status: 500,
    message: `Server Error: ${err}`,
  })
})