import { Router } from 'express';
import { login, refresh, logout } from '../controllers/authController';

const router: Router = Router();

const loginLimiter = require('../middleware/loginLimiter');

router.route('/')
    .post(loginLimiter, login);

router.route('/refresh')
    .get(refresh);

router.route('/logout')
    .post(logout);

export default router;