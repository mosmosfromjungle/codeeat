import express from 'express'
import { moleProblems } from '../controllers/MoleGameControllers/index'

express().use(express.json()) 

const router = express.Router()

// Get 10 mole game problems
router.get('/problems', moleProblems)

router.use((err, res) => {
  console.error(err)
  res.status(500).json({
    status: 500,
    message: `Server Error: ${err}`,
  })
})

export default router
