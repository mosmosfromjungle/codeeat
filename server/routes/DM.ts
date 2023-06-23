import express from 'express';
import {
  firstdata,
  loaddata,
  setfriend,
} from '../controllers/LastDMControllers';

const router = express.Router();

// router.get('/chat', chatController)
router.post('/roomList', loaddata);
router.post('/addFriend', firstdata);
router.post('/acceptFriend', setfriend);

// router.post('/deleteFriend', deleteFriend);

export default router;