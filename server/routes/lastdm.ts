import express from 'express'
import {
    loadData,
    firstdata,
    checkLast
} from '../controllers/LastDMControllers/index';

express().use(express.json());

const router = express.Router();

router.post('/roomList', loadData);
router.post('/checkIfFirst', async (req, res) => {
    try {
        const result = await checkLast(req.body)
        res.send(result)
    } catch (err) {
        console.error(err)
        res.status(500).send(err)
    }
})
export default router