import express from 'express'
import {
    loadData,
    firstdata,
    checkLast
} from '../controllers/LastDMControllers/index';

express().use(express.json());

const router = express.Router();

router.post('/roomList', loadData);
router.post('/checkIfFirst', checkLast)
export default router