import express from 'express';

import {specificEmail} from '../controllers/message';
import verifyToken from '../middleware/authenticate';

const router = express.Router();

router.get('/:id',verifyToken,specificEmail);


export default router;