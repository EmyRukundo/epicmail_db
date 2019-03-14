import express from 'express';

import {specificEmail} from '../controllers/message';

const router = express.Router();

router.get('/:id',specificEmail);


export default router;