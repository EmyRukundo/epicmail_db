import express from 'express';

import {deleteEmail} from '../controllers/message';

const router = express.Router();

router.delete('/:id',deleteEmail);


export default router;