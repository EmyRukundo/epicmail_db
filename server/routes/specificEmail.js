import express from 'express';

import {specificEmail} from '../controllers/message';

const router = express.Router();

router.get('/messages/:id',specificEmail);


export default router;