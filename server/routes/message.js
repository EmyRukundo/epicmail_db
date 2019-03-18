import express from 'express';
import {getMessages,createMessage,unreadMessage,sentMessage} from '../controllers/message';
import verifyToken from '../middleware/authenticate';
const router = express.Router();

router.get('/messages',verifyToken,getMessages);
router.get('/unread',unreadMessage);
router.get('/:sent',sentMessage);
router.post('/messages',createMessage);

export default router;