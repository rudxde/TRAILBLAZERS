import { Router } from 'express';
import { IAuthRegistration } from '@tb/interfaces';
import { verifyServiceAuthentication } from '@tb/service-utils';
import { Register } from './register';
import { publicKeys } from '../../app';

const router = Router();
router.use(verifyServiceAuthentication(publicKeys));
router.post('/', (req, res) => {
    const registration: IAuthRegistration = req.body;
    return Register(registration)
        .then(token => res.send(token))
        .catch(err => {
            console.error(err);
            return res.sendStatus(500);
        });
});
export default router;
