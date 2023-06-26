import express from 'express'
import {
    loadData
} from '../controllers/LastDMControllers/index';

express().use(express.json());

const router = express.Router();

router.post('/roomList', loadData);
router.get('/roomlist', loadData)

export default router