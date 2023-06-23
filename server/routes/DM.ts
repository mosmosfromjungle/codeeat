import express from 'express';
import {
  firstdata,
  loaddata,
  setfriend,
} from '../controllers/LastDMControllers';

const router = express.Router();

router.post('/roomList', loaddata);
router.post('/addFriend', firstdata);
router.post('/acceptFriend', setfriend);


export default router;