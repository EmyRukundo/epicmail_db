import express from 'express';
import getUsers from '../controllers/allUsers';
import login from '../controllers/login';
import signUp from '../controllers/signup';

const router = express.Router();

router.get('/getUsers',getUsers);
router.post('/signup',signUp);
router.post('/login',login);
export default router;