import { Router } from 'express';
import { getAllUsers, createNewUser, updateUser, deleteUser } from '../controllers/usersController';

const router: Router = Router();

const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);

router.route('/')
    .get(getAllUsers)
    .post(createNewUser)
    .patch(updateUser)
    .delete(deleteUser)

export default router;