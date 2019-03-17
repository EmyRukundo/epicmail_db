import express from 'express';
import {getGroups,createGroup,updateGroup,specificGroup,deleteGroup,groupMember,deleteMember,emailGroup} from '../controllers/groups';
const router = express.Router();

router.get('/groups',getGroups);
router.get('/groups/:id',specificGroup);
router.post('/groups',createGroup);
router.patch('/groups/:id/name',updateGroup);
router.delete('/groups/:id',deleteGroup);
router.post('/groups/:id/users',groupMember);
router.delete('/groups/:groupId/users/:id',deleteMember);
router.post('/groups/groupId/messages',emailGroup)


export default router;