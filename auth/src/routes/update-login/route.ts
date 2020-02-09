import { Router } from 'express';
import { verifyServiceAuthentication } from '@tb/service-utils';
import { publicKeys } from '../../app';
import { UpdateLogin } from './update-login';
import { IServiceErrors } from '@tb/interfaces';

const router = Router();

router.use(verifyServiceAuthentication(publicKeys));

router.patch('/', async (req, res) => {
    const { userId, login } = req.body;
    return UpdateLogin(userId, login)
        .then(() => res.sendStatus(200))
        .catch((err: IServiceErrors) => {
            if (err.isServiceError) return res.sendStatus(err.statusCode);
            console.log(err);
            return res.sendStatus(500);
        });
});

export default router;
