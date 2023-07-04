import express from 'express'
import {
    loadData,
    checkLast,
    getThatRoom
} from '../controllers/LastDMControllers/index';

express().use(express.json());

const router = express.Router();

router.post('/getRoom', getThatRoom)
router.post('/roomList', loadData);
router.post('/checkIfFirst', checkLast)

export default router