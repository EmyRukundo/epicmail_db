import express from 'express';
import {getMessages,createMessage,unreadMessage,sentMessage} from '../controllers/message';
const router = express.Router();

router.get('/messages',getMessages);
router.get('/unread',unreadMessage);
router.get('/sent',sentMessage);
router.post('/messages',createMessage);


export default router;