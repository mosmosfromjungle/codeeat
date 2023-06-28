import express from 'express'
import {
    loadData,
    firstdata
} from '../controllers/LastDMControllers/index';

express().use(express.json());

const router = express.Router();

router.post('/roomList', loadData);
router.post('/newdm', firstdata)
export default router