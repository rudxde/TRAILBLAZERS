import { Router } from 'express';
import { Logout } from './logout';
import { IServiceErrors } from '@tb/interfaces';

const router = Router();
router.get('/', (req, res) => {
    const authToken = req.headers['authorization'];
    return Logout(authToken)
        .then(token => res.send(token))
        .catch((err: IServiceErrors) => {
            if (err.isServiceError) return res.sendStatus(err.statusCode);
            console.error(err);
            return res.sendStatus(500);
        });
});

export default router;
