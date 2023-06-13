import express from 'express';
// import 'express-async-errors';
import {
    update,
    signUp,
    login,
    authenticateToken,
    userProfile,
    updateProfile,
//   updateUserWithAuth,
//   inquireUser,
//   deleteUser,
//   authenticateUser,
//   issueAccessToken,
} from '../controllers/UserControllers/index';
import User from '../models/User'

express().use(express.json()); 

const router = express.Router();

router.post('/update', update);

router.post('/signup', signUp);

router.post('/login', login);

router.get('/myprofile', authenticateToken, userProfile);

router.patch('/update', authenticateToken, updateProfile);

// router.get('/isAuth', authenticateUser);

// router.post('/issueAccessToken', issueAccessToken);

// router.delete('/delete', deleteUser);

// router.use((err, res) => {
//   console.error(err);
//   res.status(500).json({
//     status: 500,
//     message: `서버 오류: ${err}`,
//   });
// });

export default router;
