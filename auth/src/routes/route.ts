import { Router } from 'express';

import login from './login/route';
import logout from './logout/route';
import token from './token/route';
import register from './register/route';
import updateLogin from './update-login/route';
import password from './password/route';

const router = Router();

router.use('/login', login);
router.use('/logout', logout);
router.use('/token', token);
router.use('/register', register);
router.use('/update-login', updateLogin);
router.use('/password', password);

export default router;
