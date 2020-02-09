import { Router } from 'express';
import { IRegistration } from '@tb/interfaces';
import { Register } from './register';

const router = Router();
router.post('/', (req, res) => {
    const registration: IRegistration = req.body;
    return Register(registration)
        .then(token => res.send(token))
        .catch(err => {
            console.error(err);
            return res.sendStatus(500);
        });
});
export default router;
