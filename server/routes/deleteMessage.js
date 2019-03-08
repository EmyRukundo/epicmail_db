import express from 'express';

import {deleteEmail} from '../controllers/message';

const router = express.Router();

router.delete('/messages/:id',deleteEmail);


export default router;