import express from 'express';
import {
    addDM,
}from '../controllers/DMControllers';

express().use(express.json());
const router = express.Router();

router.post('/newdm', addDM)

export default router;