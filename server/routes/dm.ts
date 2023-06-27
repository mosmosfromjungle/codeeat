import express from 'express';
import { DMController } from '../controllers/DMControllers';

express().use(express.json());
const router = express.Router();

router.post('/', DMController)

export default router;