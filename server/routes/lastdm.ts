import express from 'express'
import {
    loadData,
    checkLast,
    addLastDM
} from '../controllers/LastDMControllers/index';

express().use(express.json());

const router = express.Router();

router.post('/injectLastDM', addLastDM)
router.post('/roomList', loadData);
router.post('/checkIfFirst', checkLast)

export default router