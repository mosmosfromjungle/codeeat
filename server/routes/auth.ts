import express from 'express';
import {
    signUp,
    login,
    authenticateToken,
    myProfile,
    updateProfile,
    refreshAccessToken,
    authenticateUser,
    userProfile,
} from '../controllers/UserControllers/index';

express().use(express.json()); 

const router = express.Router();

router.post('/signup', signUp);

router.post('/login', login);

router.get('/myprofile', authenticateToken, myProfile);

router.patch('/update', authenticateToken, updateProfile);

router.post('/refresh', refreshAccessToken);

router.get('/authenticate', authenticateUser)

router.get('/profile/:username', userProfile);

// router.delete('/delete', deleteUser);

router.use((err, res) => {
  console.error(err);
  res.status(500).json({
    status: 500,
    message: `서버 오류: ${err}`,
  });
});

export default router;
